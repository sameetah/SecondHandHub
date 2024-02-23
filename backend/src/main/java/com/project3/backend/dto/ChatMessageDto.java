package com.project3.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long id;
    private String content;
    private Long chatId;
    private Double price;
    private UserDtoSecure sender;
    private String sentTimestampMillis;
    private String imageUrl;
}
