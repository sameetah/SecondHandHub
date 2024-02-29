package com.project3.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {

    private Long id;
    private String title;
    private String description;
    private double price;
    private String location;
    private String imageUrl;
    private UserDtoSecure user;
    private Long seenBy;
    private String createdAt;
    private String category;
    private Boolean active;

    public ProductDto(Long id, String title, String description, double price, String location, String imageUrl, UserDtoSecure user, Long seenBy, String createdAt, String category, Boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.imageUrl = imageUrl;
        this.user = user;
        this.seenBy = seenBy;
        this.createdAt = createdAt;
        this.category = category;
        this.active = active;
    }
}
