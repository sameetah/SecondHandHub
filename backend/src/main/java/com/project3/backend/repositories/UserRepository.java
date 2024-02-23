package com.project3.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project3.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

    void deleteEmployeeById(Long id);

    Optional<User> findByLogin(String login);

    Optional<User> findUserById(Long id);

}
