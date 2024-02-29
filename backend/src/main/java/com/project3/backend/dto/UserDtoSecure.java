package com.project3.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserDtoSecure {

    private Long id;
    private String firstName;
    private String secondName;
    private String imageUrl;
    private String joined;

}
