package com.klu.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.models.Users;
import com.klu.service.UsersService;

@RestController
@RequestMapping("/user")
public class UsersController {

    @Autowired
    UsersService US;

    @PostMapping("/signup")
    public Object Signup(@RequestBody Users U) {
        return US.signup(U);
    }

    @PostMapping("/signin")
    public Object Signin(@RequestBody Map<String, Object> data) {
        return US.signin(data);
    }

    @GetMapping("/uinfo")
    public Object uinfo(@RequestHeader("Token") String token) {
        return US.uinfo(token);
    }

    @GetMapping("/profile")
    public Object profile(@RequestHeader("Token") String token) {
        return US.getProfile(token);
    }

    @GetMapping("/getallusers/{PAGE}/{SIZE}")
    public Object getAllUsers(
            @PathVariable("PAGE") int page,
            @PathVariable("SIZE") int size,
            @RequestHeader("Token") String token) {
        return US.getAllUsers(page, size, token);
    }

    @PostMapping("/saveuser")
    public Object saveUser(@RequestBody Users U, @RequestHeader("Token") String Token) {
        return US.saveUser(U, Token);
    }

    @PutMapping("/updateuser/{id}")
    public Object updateUser(
            @PathVariable("id") Long id,
            @RequestBody Users updatedUser,
            @RequestHeader("Token") String token) {
        return US.updateUser(id, updatedUser, token);
    }

    @DeleteMapping("/deleteUser/{id}")
    public Object deleteUser(
            @PathVariable("id") Long id,
            @RequestHeader("Token") String Token) {
        return US.deleteUser(id, Token);
    }

    // ✅ FIXED: Consistent naming
    @GetMapping("/getuser/{id}")
    public Object getUser(@PathVariable("id") Long id, @RequestHeader("Token") String Token) {
        return US.getUserById(id, Token);
    }
    
    @GetMapping("/searchuser/{KEY}")
    public Object getUsers(@PathVariable("KEY") String key, @RequestHeader("Token") String Token)
    {
        return US.searchUser(key,Token);
    }
}