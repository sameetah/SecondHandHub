package com.project3.backend.controllers;

import com.project3.backend.config.UserAuthProvider;
import com.project3.backend.dto.ConfirmResetRequestDto;
import com.project3.backend.dto.CredentialsDto;
import com.project3.backend.dto.EmailDto;
import com.project3.backend.dto.SignupDto;
import com.project3.backend.dto.UserDto;
import com.project3.backend.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.net.URI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthenticationProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        System.out.println(credentialsDto);
        UserDto userDto = userService.login(credentialsDto);
        userDto.setToken(userAuthenticationProvider.createToken(userDto));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignupDto user) {
        UserDto createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(createdUser));
        System.out.println(createdUser);
        return ResponseEntity.created(URI.create("/users/" + createdUser.getId())).body(createdUser);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> requestReset(@RequestBody EmailDto emailDTO) {
        userService.createPasswordResetCode(emailDTO.getEmail());
        return new ResponseEntity<>("Code sent to email", HttpStatus.OK);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody ConfirmResetRequestDto request) {
        userService.validateCodeAndResetPassword(request);
        return new ResponseEntity<>("Password reset successful", HttpStatus.OK);
    }

}
