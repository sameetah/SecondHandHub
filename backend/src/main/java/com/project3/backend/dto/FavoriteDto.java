package com.project3.backend.dto;

import java.time.LocalDateTime;

import com.project3.backend.entities.Product;
import com.project3.backend.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FavoriteDto {
    private Long id;
    private Long userId;
    private ProductDto productId;
    //private LocalDateTime dateFavorited; // check chatmessage.java
}
