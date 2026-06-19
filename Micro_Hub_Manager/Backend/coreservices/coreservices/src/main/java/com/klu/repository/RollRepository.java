package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.models.Roles;

@Repository
public interface RollRepository extends JpaRepository<Roles, Long> { // Data type of the primary key of the table

}
