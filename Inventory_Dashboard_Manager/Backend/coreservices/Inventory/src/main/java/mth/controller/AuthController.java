package mth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import mth.dto.*;
import mth.entity.Users;
import mth.exception.ResourceNotFoundException;
import mth.repository.UsersRepository;
import mth.service.UsersServices;
import mth.service.Jwtservice;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersServices usersServices;
    private final Jwtservice jwtService;
    private final UsersRepository usersRepository;

    public AuthController(UsersServices usersServices, Jwtservice jwtService, UsersRepository usersRepository) {
        this.usersServices = usersServices;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<TokenResponseDTO>> register(@Valid @RequestBody UserCreateDTO dto) {
        TokenResponseDTO response = usersServices.signup(dto);
        return new ResponseEntity<>(ApiResponseDTO.success(response, "User registered successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<TokenResponseDTO>> login(@Valid @RequestBody UserLoginDTO dto) {
        TokenResponseDTO response = usersServices.signin(dto);
        return ResponseEntity.ok(ApiResponseDTO.success(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> getCurrentUser(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(ApiResponseDTO.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
        }
        UserResponseDTO response = usersServices.getCurrentUser(principal.getName());
        return ResponseEntity.ok(ApiResponseDTO.success(response, "User profile retrieved"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponseDTO<TokenResponseDTO>> refreshToken(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(ApiResponseDTO.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
        }
        TokenResponseDTO response = usersServices.refreshToken(principal.getName());
        return ResponseEntity.ok(ApiResponseDTO.success(response, "Token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> logout(Principal principal) {
        String email = principal != null ? principal.getName() : "anonymous";
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Successfully logged out");
        data.put("user", email);
        return ResponseEntity.ok(ApiResponseDTO.success(data, "Logout successful"));
    }

    @GetMapping("/verify-token")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> verifyToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(ApiResponseDTO.error("Missing or invalid token", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        Map<String, Object> claims = jwtService.validateJWT(token);
        if (claims == null) {
            return new ResponseEntity<>(ApiResponseDTO.error("Invalid or expired token", HttpStatus.UNAUTHORIZED.value()), HttpStatus.UNAUTHORIZED);
        }

        String email = (String) claims.get("email");
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("valid", true);
        responseData.put("user_id", user.getId());
        responseData.put("email", user.getEmail());
        responseData.put("role", user.getRole());

        return ResponseEntity.ok(ApiResponseDTO.success(responseData, "Token verified"));
    }
}
