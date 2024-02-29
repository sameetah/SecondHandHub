package com.project3.backend.resources;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project3.backend.dto.ProductImagesDto;
import com.project3.backend.entities.ProductImages;
import com.project3.backend.mappers.ProductImagesMapper;
import com.project3.backend.services.ProductImagesService;

@RestController
@RequestMapping(value = "/productImages")
public class ProductImagesResources {
    private final ProductImagesService productImagesService;
    private final ProductImagesMapper productImagesMapper;

    public ProductImagesResources(ProductImagesService productImagesService, ProductImagesMapper productImagesMapper) {
        this.productImagesService = productImagesService;
        this.productImagesMapper = productImagesMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProductImages>> getAllProductImages() {
        List<ProductImages> productImages = productImagesService.findAllProductImages();
        return new ResponseEntity<>(productImages, HttpStatus.OK);
    }

    @GetMapping(params = "productId")
    public ResponseEntity<List<ProductImagesDto>> getProductImagesByProductId(@RequestParam("productId") Long id) {
        List<ProductImages> productImages = productImagesService.findAllProductImagesByProductId(id);
        return new ResponseEntity<>(productImagesMapper.toProductImagesDtoList(productImages), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductImagesDto> getProductImagesById(@PathVariable("id") Long id) {
        ProductImages productImages = productImagesService.findProductImagesById(id);
        return new ResponseEntity<>(productImagesMapper.toProductImagesDto(productImages), HttpStatus.OK);
    }

    @PostMapping // Change from PUT to POST for creation
    public ResponseEntity<ProductImagesDto> createProductImages(@RequestBody ProductImagesDto productImages) {
        ProductImagesDto newProductImages = productImagesService.addProductImages(productImages);
        return new ResponseEntity<>(newProductImages, HttpStatus.CREATED); // Changed status code to 201 Created
    }

}
