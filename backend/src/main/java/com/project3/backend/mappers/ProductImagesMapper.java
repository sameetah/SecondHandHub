package com.project3.backend.mappers;

import com.project3.backend.dto.ProductImagesDto;
import com.project3.backend.entities.ProductImages;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ProductImagesMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "imageUrl", target = "imageUrl")
    @Mapping(source = "product.id", target = "productId")
    public abstract ProductImagesDto toProductImagesDto(ProductImages productImages);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "imageUrl", target = "imageUrl")
    @Mapping(source = "productId", target = "product.id")
    public abstract ProductImages toProductImages(ProductImagesDto productImagesDto);

    public List<ProductImagesDto> toProductImagesDtoList(List<ProductImages> productImages) {
        return productImages.stream()
                .map(this::toProductImagesDto)
                .collect(Collectors.toList());
    }
}
