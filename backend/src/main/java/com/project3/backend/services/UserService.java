package com.project3.backend.services;

import java.io.InputStream;
import java.nio.CharBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.ConfirmResetRequestDto;
import com.project3.backend.dto.CredentialsDto;
import com.project3.backend.dto.SignupDto;
import com.project3.backend.dto.UserDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.PasswordResetToken;
import com.project3.backend.entities.User;
import com.project3.backend.exceptions.AppException;
import com.project3.backend.helpers.CodeGenerator;
import com.project3.backend.mappers.UserMapper;
import com.project3.backend.repositories.PasswordResetTokenRepository;
import com.project3.backend.repositories.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import java.nio.charset.StandardCharsets;
import java.io.InputStream;
import org.springframework.util.StreamUtils;
import org.springframework.core.io.Resource;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private ResourceLoader resourceLoader;

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new AppException("No User with this Login", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()),
                user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    };

    public UserDto register(SignupDto signupDto) {
        Optional<User> oUser = userRepository.findByLogin(signupDto.login());

        if (oUser.isPresent()) {
            throw new AppException("User allrdy exist", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(signupDto);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signupDto.password())));
        User savedUser = userRepository.save(user);
        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByLogin(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public String updateUser(Long id, UserDtoSecure user) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User originalUser = optionalUser.get();
            System.out.println(user);
            System.out.println(originalUser);
            if (user.getFirstName() != null) {
                originalUser.setFirstName(user.getFirstName());
            }
            if (user.getSecondName() != null) {
                originalUser.setSecondName(user.getSecondName());
            }
            if (user.getImageUrl() != null) {
                originalUser.setImageUrl(user.getImageUrl());
            }

            originalUser = userRepository.save(originalUser);
            return "Updated";
        }
        throw new AppException("Unknown user", HttpStatus.NOT_FOUND);
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    public void createPasswordResetCode(String Email) {
        Optional<User> optionalUser = userRepository.findByLogin(Email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Delete existing token if it exists
            Optional<PasswordResetToken> existingToken = tokenRepository.findByUser(user);
            existingToken.ifPresent(token -> tokenRepository.delete(token));

            PasswordResetToken resetCode = new PasswordResetToken();
            resetCode.setUser(user);
            resetCode.setToken(CodeGenerator.generateAlphanumericCode(8));
            resetCode.setExpiryDate(LocalDateTime.now().plusMinutes(15));
            tokenRepository.save(resetCode);

            String htmlContent = readEmailTemplate("resetPassword.html");
            htmlContent = htmlContent.replace("[RESET_CODE_HERE]", resetCode.getToken());

            try {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
                helper.setFrom("secondhandhub3@outlook.com");
                helper.setTo(user.getLogin());
                helper.setSubject("Password Reset Code");
                mimeMessage.setContent(htmlContent, "text/html");
                javaMailSender.send(mimeMessage);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    public String readEmailTemplate(String path) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + path);
            InputStream inputStream = resource.getInputStream();
            byte[] encoded = StreamUtils.copyToByteArray(inputStream);
            return new String(encoded, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // Handle exception
            e.printStackTrace();
            return "";
        }
    }

    public void validateCodeAndResetPassword(ConfirmResetRequestDto request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getCode());
        if (resetToken != null) {
            if (resetToken.getExpiryDate().isAfter(LocalDateTime.now())) {
                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(CharBuffer.wrap(request.getNewPassword())));
                userRepository.save(user);
                tokenRepository.delete(resetToken);
            } else {
                throw new AppException("Token expired", HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new AppException("Invalid token", HttpStatus.BAD_REQUEST);
        }
    }

}
