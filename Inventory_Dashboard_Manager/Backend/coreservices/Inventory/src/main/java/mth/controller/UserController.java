package mth.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mth.dto.ApiResponseDTO;
import mth.dto.UserResponseDTO;
import mth.dto.UserUpdateDTO;
import mth.service.UsersServices;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UsersServices usersServices;

    public UserController(UsersServices usersServices) {
        this.usersServices = usersServices;
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<Page<UserResponseDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<UserResponseDTO> users = usersServices.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponseDTO.success(users, "Users retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO dto) {
        
        UserResponseDTO updatedUser = usersServices.updateUser(id, dto);
        return ResponseEntity.ok(ApiResponseDTO.success(updatedUser, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Map<String, String>>> deleteUser(@PathVariable Long id) {
        usersServices.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(ApiResponseDTO.success(response, "User deleted successfully"));
    }
}
