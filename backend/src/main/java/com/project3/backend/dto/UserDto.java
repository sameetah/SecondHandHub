package com.project3.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDto {

    private Long id;
    private String firstName;
    private String secondName;
    private String login;
    private String token;
    private String joined;

    public Long getId() {
        return id;
    }

}
