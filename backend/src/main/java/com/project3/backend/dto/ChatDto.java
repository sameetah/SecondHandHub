package com.project3.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDto {

    private Long id;
    private UserDtoSecure user1;
    private UserDtoSecure user2;
    private ProductDto product;
}
