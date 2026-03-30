package com.ticketing.ticketservice.service;

import com.ticketing.ticketservice.entity.Users;
import com.ticketing.ticketservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Users saveUser(Users user) {
        return userRepository.save(user);
    }
}