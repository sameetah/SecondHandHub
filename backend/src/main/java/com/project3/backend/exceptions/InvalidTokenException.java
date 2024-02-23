package com.project3.backend.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends AppException {
    public InvalidTokenException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
