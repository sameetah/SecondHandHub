package com.project3.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.FavoriteDto;
import com.project3.backend.dto.ProductDto;
import com.project3.backend.entities.Favorite;
import com.project3.backend.entities.Product;
import com.project3.backend.mappers.FavoriteMapper;
import com.project3.backend.mappers.ProductMapper;
import com.project3.backend.repositories.FavoriteProductRepository;
import com.project3.backend.repositories.ProductRepository;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
//@RequiredArgsConstructor
@NoArgsConstructor

public class FavoriteProductService {

    @Autowired
    private FavoriteProductRepository favoriteProductRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private FavoriteMapper favoriteMapper;
    @Autowired
    private ProductMapper productMapper;

    public List<ProductDto> getAllFavoriteProductsByUserId(Long userId) {
        List<Product> favProduct = productRepository.findAllFavoriteProductsByUserId(userId);
               return productMapper.toProductsDto(favProduct);
    }

    public boolean isProductInFavorites(Long userId, Long productId) {
        List<Product> favProduct = productRepository.findAllFavoriteProductsByUserId(userId);
                return favProduct.stream().anyMatch(product -> product.getId().equals(productId));
    }

    //It accepts a FavoriteDto as input. 
    //It converts the DTO to an entity, processes the entity (e.g., saving it to the database), and then converts the saved entity back to a DTO. 
    //It returns the FavoriteDto as the result of the operation.
    public FavoriteDto addFavorites(FavoriteDto favoriteDto) {
        Favorite favoriteEntity = favoriteMapper.toFavorite(favoriteDto);
        favoriteEntity = favoriteProductRepository.save(favoriteEntity);
        return favoriteMapper.toFavoriteDto(favoriteEntity);
   }
   
    public void removeFromFavorites(FavoriteDto favoriteDto) {
        Long userId = favoriteDto.getUserId();
        Long productId = favoriteDto.getProductId().getId();
        Favorite favProduct = favoriteProductRepository.findByUserIdAndProductId(userId, productId);
            favoriteProductRepository.delete(favProduct);
    }

    public List<ProductDto> getRecommendedProducts(Long userId) {
        List<Product> recommendedProducts = productRepository.findAllProductsInTopCategoryOfUserFavorites(userId);
            return productMapper.toProductsDto(recommendedProducts);
    }
}
