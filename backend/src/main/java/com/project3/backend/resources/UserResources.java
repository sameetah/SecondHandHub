package com.project3.backend.resources;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.User;
import com.project3.backend.mappers.UserMapper;
import com.project3.backend.services.UserService;

@RestController
@RequestMapping(value = "/users")
public class UserResources {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserResources(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    // Fetch all users
    @GetMapping
    public ResponseEntity<List<UserDtoSecure>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(userMapper.toUsersDtoSecure(users), HttpStatus.OK);
    }

    // Fetch a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDtoSecure> getUserById(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        return new ResponseEntity<>(userMapper.toUsersDtoSecure(user), HttpStatus.OK);
    }

    // Update a user by ID
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") Long id, @RequestBody UserDtoSecure user) {
        System.out.println(user);
        String updateUser = userService.updateUser(id, user);
        return new ResponseEntity<>(updateUser, HttpStatus.OK);
    }

}
