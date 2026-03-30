package com.ticketing.ticketservice.repository;

import com.ticketing.ticketservice.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {

}