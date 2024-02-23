package com.project3.backend.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.ProductDto;
import com.project3.backend.entities.Chat;
import com.project3.backend.entities.ChatMessage;
import com.project3.backend.entities.Product;
import com.project3.backend.entities.ProductImages;
import com.project3.backend.exceptions.AppException;
import com.project3.backend.mappers.ProductMapper;
import com.project3.backend.repositories.ChatRepository;
import com.project3.backend.repositories.ProductImagesRepository;
import com.project3.backend.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductImagesRepository productImagesRepository;
    private final ChatRepository chatRepository;

    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    public Page<Product> findAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<String> findDistinctLocations() {
        return productRepository.findDistinctLocations();
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    public Page<Product> findAllProductsByCategory(String category, Pageable pageable) {
        return productRepository.findAllProductsByCategory(category, pageable);
    }

    public List<Product> getAllProductByUserId(Long user_id) {
        return productRepository.findAllProductsByUserId(user_id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    // public List<Product> getAllProductByUserInput(String title) {
    // return productRepository.findAllProductsByUserInput(title)
    // .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    // }

    public ProductDto addProduct(ProductDto product) {
        Product saveProduct = productRepository.saveAndFlush(productMapper.toProduct(product));
        return productMapper.toProductDto(saveProduct);
    }

    public ProductDto updateProduct(ProductDto product) {
        Product saveProduct = productRepository.saveAndFlush(productMapper.toProduct(product));
        return productMapper.toProductDto(saveProduct);
    }

    public void deleteProductById(Long id) {

        // Checks if a chat for the Product exists
        Optional<List<Chat>> chatOpt = chatRepository.findAllChatByProductId(id);
        chatOpt.ifPresent(chats -> {
            if (chats.isEmpty()) {

                // Delete chats associated with the product
                chatRepository.deleteAll(chats);

                // If there are product images, delete them
                Optional<List<ProductImages>> productImagesOpt = productImagesRepository
                        .findAllProductImagesByProductId(id);
                productImagesOpt.ifPresent(productImages -> {
                    if (!productImages.isEmpty()) {
                        productImagesRepository.deleteAll(productImages);
                    }
                });
                // Now, delete the product
                productRepository.deleteById(id);
            }
            // If no chats are associated with the product, set the Product to inactive
            else {
                Optional<Product> foundProduct = productRepository.findById(id);
                foundProduct.ifPresent(product -> {
                    product.setActive(false);
                    productRepository.save(product);
                });
            }
        });
    }

    public List<Product> getProductsByTitleOrDescriptionContainingNative(String keyword) {
        return productRepository.getProductsByTitleOrDescriptionContainingNative(keyword);
    }

    public List<Product> findProductsByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Product> findProductsByPriceGreaterThan(BigDecimal minPrice) {
        return productRepository.findByPriceGreaterThan(minPrice);
    }

        public List<Product> findProductsByPriceLessThan(BigDecimal maxPrice) {
        return productRepository.findByPriceLessThan(maxPrice);
    }

    public List<ProductDto> getAllProductDtos(Specification<Product> spec, Sort sort) {
        List<Product> products = productRepository.findAll(spec, sort);
        return productMapper.toProductsDto(products);
    }


    }


