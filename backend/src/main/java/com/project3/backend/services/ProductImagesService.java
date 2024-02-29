package com.project3.backend.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.ProductImagesDto;
import com.project3.backend.entities.ProductImages;
import com.project3.backend.exceptions.AppException;
import com.project3.backend.mappers.ProductImagesMapper;
import com.project3.backend.repositories.ProductImagesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ProductImagesService {

    private final ProductImagesRepository productImagesRepository;
    private final ProductImagesMapper productImagesMapper;

    public List<ProductImages> findAllProductImages() {
        return productImagesRepository.findAll();
    }

    public List<ProductImages> findAllProductImagesByProductId(Long userId) {
        return productImagesRepository.findAllProductImagesByProductId(userId)
                .orElseThrow(() -> new AppException("No ProductImages messages", HttpStatus.NOT_FOUND));

    }

    public ProductImages findProductImagesById(Long id) {
        return productImagesRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    public ProductImagesDto addProductImages(ProductImagesDto productImages) {
        ProductImages saveProductImages = productImagesRepository
                .save(productImagesMapper.toProductImages(productImages));
        return productImagesMapper.toProductImagesDto(saveProductImages);
    }

}
