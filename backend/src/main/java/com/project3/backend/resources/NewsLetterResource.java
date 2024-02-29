package com.project3.backend.resources;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project3.backend.dto.EmailDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.User;
import com.project3.backend.mappers.UserMapper;
import com.project3.backend.services.NewsLetterService;
import com.project3.backend.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/newsletter")
public class NewsLetterResource {

    private final NewsLetterService newsLetterService;

    @PostMapping
    public ResponseEntity<?> subscribeNewsletter(@RequestBody EmailDto emailDTO) {
        newsLetterService.subscribeNewsletter(emailDTO);
        return new ResponseEntity<>("Subscribed to Newsletter", HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> unsubscribeNewsletter(@RequestBody EmailDto emailDTO) {
        newsLetterService.unsubscribeNewsletter(emailDTO);
        return new ResponseEntity<>("Subscribed to Newsletter", HttpStatus.OK);
    }
}
