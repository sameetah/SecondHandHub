package com.project3.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import com.project3.backend.dto.FavoriteDto;
import com.project3.backend.dto.ProductDto;
import com.project3.backend.entities.Favorite;
import com.project3.backend.entities.Product;
import com.project3.backend.repositories.FavoriteProductRepository;
import com.project3.backend.services.ProductService;



@Mapper(componentModel = "spring", uses = { FavoriteProductRepository.class })
public abstract class FavoriteMapper {

    @Autowired
    private ProductService productService;

    @Mapping(source = "product", target = "productId")
    @Mapping(source = "user.id", target = "userId")
    public abstract FavoriteDto toFavoriteDto(Favorite favorite);

    @Mapping(source = "productId", target = "product", qualifiedByName = "mapProductFromDto")
    @Mapping(source = "userId", target = "user.id")
    public abstract Favorite toFavorite(FavoriteDto favoriteDto);

    @Named("mapProductFromDto")
    protected Product mapProductFromDto(ProductDto productDto) {
        return productService.findProductById(productDto.getId());
    }

}
