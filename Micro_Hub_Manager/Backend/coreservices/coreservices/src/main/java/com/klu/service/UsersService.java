package com.klu.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.klu.models.Roles;
import com.klu.models.Users;
import com.klu.repository.RollRepository;
import com.klu.repository.UsersRepository;

@Service
public class UsersService {

    @Autowired
    UsersRepository UR;

    @Autowired
    Jwtservice JWT;

    @Autowired
    RollRepository RR;

    // ====================== SIGNUP ======================
    public Object signup(Users U) {
        Map<String, Object> response = new HashMap<>();
        try {
            Object id = UR.checkByEmail(U.getEmail());
            if (id != null) {
                response.put("code", 501);
                response.put("message", "Email ID already registered");
            } else {
                U.setRole(1); // Default role
                U.setStatus(1); // Active status
                UR.save(U);
                response.put("code", 200);
                response.put("message", "User account has been created.");
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== SIGNIN ======================
    public Object signin(Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            Object role = UR.validateCredentials(data.get("username").toString(),
                    data.get("password").toString());
            Users user = (Users) UR.findByEmail(data.get("username").toString());
            if (role != null) {
                response.put("code", 200);
                response.put("jwt", JWT.generateJWT(data.get("username"), role,user.getId()));
            } else {
                response.put("code", 404);
                response.put("message", "Invalid Credentials");
            }
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== USER INFO ======================
    public Object uinfo(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = JWT.validateJWT(token);
            String email = (String) payload.get("username");
            Users U = (Users) UR.findByEmail(email);
            List<Object> menuList = UR.getMenus(Long.valueOf(U.getRole()));

            response.put("code", 200);
            response.put("fullname", U.getFullname());
            response.put("menulist", menuList);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== PROFILE ======================
    public Object getProfile(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> payload = JWT.validateJWT(token);
            String email = (String) payload.get("username");
            Object user = UR.profileByEmail(email);

            response.put("code", 200);
            response.put("user", user);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== GET ALL USERS ======================
    public Object getAllUsers(int page, int size, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            JWT.validateJWT(token);
            Pageable pageable = PageRequest.of(page - 1, size);
            Page<Users> users = UR.findAll(pageable);
            List<Roles> roles = RR.findAll();

            response.put("code", 200);
            response.put("page", page);
            response.put("size", size);
            response.put("totalpages", users.getTotalPages());
            response.put("users", users.getContent());
            response.put("roles", roles);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== SAVE NEW USER ======================
    public Object saveUser(Users U, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            JWT.validateJWT(token);
            Object id = UR.checkByEmail(U.getEmail());
            if (id != null) {
                throw new Exception("Email ID already registered");
            }
            UR.save(U);
            response.put("code", 200);
            response.put("message", "New User account has been created");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== UPDATE USER (FIXED) ======================
    public Object updateUser(Long id, Users updatedUser, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            JWT.validateJWT(token); // Authorization

            if (!UR.existsById(id)) {
                response.put("code", 404);
                response.put("message", "User not found");
                return response;
            }

            // Check email conflict with other users
            Object existingEmailCheck = UR.checkByEmail(updatedUser.getEmail());
            if (existingEmailCheck != null) {
                if (!existingEmailCheck.toString().equals(id.toString())) {
                    response.put("code", 501);
                    response.put("message", "Email ID already registered by another user");
                    return response;
                }
            }

            Users existingUser = UR.findById(id).get();

            // Update fields
            existingUser.setFullname(updatedUser.getFullname());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setEmail(updatedUser.getEmail());
            
            // Fixed: Role is likely primitive 'int', so we check != 0
            if (updatedUser.getRole() != 0) {
                existingUser.setRole(updatedUser.getRole());
            }

            // Update password only if provided and not empty
            if (updatedUser.getPassword() != null && 
                !updatedUser.getPassword().trim().isEmpty()) {
                existingUser.setPassword(updatedUser.getPassword());
            }

            UR.save(existingUser);

            response.put("code", 200);
            response.put("message", "User updated successfully");

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== DELETE USER ======================
    public Object deleteUser(Long id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            JWT.validateJWT(token);
            UR.deleteById(id);
            response.put("code", 200);
            response.put("message", "User has been deleted");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ====================== GET USER BY ID ======================
    public Object getUserById(Long id, String token)
    {
      Map<String, Object> response = new HashMap<>();
      try
      {
        JWT.validateJWT(token); //Authorization
        Users user = UR.findById(id).get();
        
            response.put("code", 200);
            response.put("user", user);
      }catch(Exception e)
      {
        response.put("code", 500);
        response.put("message", e.getMessage());
      }
      return response;
    }
    
    public Object searchUser(String key, String token)
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            List<Object> users = UR.searchUser(key);
            response.put("code", 200);
                response.put("users", users);
        }catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }
        return response;
    }
}