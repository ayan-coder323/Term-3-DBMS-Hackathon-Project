package mth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import mth.dto.*;
import mth.entity.Users;
import mth.exception.DuplicateResourceException;
import mth.exception.ResourceNotFoundException;
import mth.repository.UsersRepository;

@Service
public class UsersServices {

    private final UsersRepository usersRepository;
    private final Jwtservice jwtService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsersServices(UsersRepository usersRepository, Jwtservice jwtService, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user.
     */
    public TokenResponseDTO signup(UserCreateDTO dto) {
        // Check if email already exists
        if (usersRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + dto.getEmail());
        }

        // Check if username already exists
        if (usersRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + dto.getUsername());
        }

        // Create user entity
        Users user = new Users();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole() != null ? dto.getRole() : "user");
        user.setIsActive(1);

        Users savedUser = usersRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateJWT(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());

        TokenResponseDTO response = new TokenResponseDTO();
        response.setAccessToken(token);
        response.setTokenType("bearer");
        response.setUser(toUserResponse(savedUser));
        return response;
    }

    /**
     * Authenticate user and return token.
     */
    public TokenResponseDTO signin(UserLoginDTO dto) {
        Users user = usersRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!dto.getPassword().equals(user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        if (user.getIsActive() == 0) {
            throw new ResourceNotFoundException("Account is deactivated");
        }

        String token = jwtService.generateJWT(user.getEmail(), user.getId(), user.getRole());

        TokenResponseDTO response = new TokenResponseDTO();
        response.setAccessToken(token);
        response.setTokenType("bearer");
        response.setUser(toUserResponse(user));
        return response;
    }

    /**
     * Get current user from email.
     */
    public UserResponseDTO getCurrentUser(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserResponse(user);
    }

    /**
     * Refresh token for a user.
     */
    public TokenResponseDTO refreshToken(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateJWT(user.getEmail(), user.getId(), user.getRole());

        TokenResponseDTO response = new TokenResponseDTO();
        response.setAccessToken(token);
        response.setTokenType("bearer");
        response.setUser(toUserResponse(user));
        return response;
    }

    /**
     * Get all users (Paginated).
     */
    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        return usersRepository.findAll(pageable).map(this::toUserResponse);
    }

    /**
     * Get all active user emails for assignment dropdowns.
     */
    public java.util.List<java.util.Map<String, Object>> getAllActiveUserEmails() {
        java.util.List<Users> activeUsers = usersRepository.findAllByIsActive(1);
        return activeUsers.stream().map(user -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("email", user.getEmail());
            map.put("username", user.getUsername());
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    /**
     * Update user role and active status.
     */
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        user.setRole(dto.getRole() != null ? dto.getRole() : user.getRole());
        user.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : user.getIsActive());

        Users updatedUser = usersRepository.save(user);
        return toUserResponse(updatedUser);
    }

    /**
     * Delete user by ID.
     */
    public void deleteUser(Long id) {
        if (!usersRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id " + id);
        }
        usersRepository.deleteById(id);
    }

    /**
     * Convert Users entity to UserResponseDTO.
     */
    private UserResponseDTO toUserResponse(Users user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
