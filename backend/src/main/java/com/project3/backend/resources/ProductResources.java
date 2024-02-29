package com.project3.backend.resources;

import java.math.BigDecimal;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.project3.backend.dto.PageResponse;
import com.project3.backend.dto.FavoriteDto;
import com.project3.backend.dto.ProductDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.Autowired;
import com.project3.backend.entities.Product;
import com.project3.backend.entities.User;
import com.project3.backend.mappers.ProductMapper;
import com.project3.backend.services.FavoriteProductService;
import com.project3.backend.services.ProductService;

@RestController
@RequestMapping(value = "/products")
public class ProductResources {
    private final ProductService productService;
    @org.springframework.beans.factory.annotation.Autowired
    private ProductMapper productMapper;
    @org.springframework.beans.factory.annotation.Autowired
    private FavoriteProductService favoriteProductService;

    public ProductResources(ProductService productService, ProductMapper productMapper, FavoriteProductService favoriteProductService) {
        this.productService = productService;
        this.productMapper = productMapper;
        this.favoriteProductService = favoriteProductService;
    }

    // Get Products with pagination
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productService.findAllProducts(pageable);

        HttpHeaders responseHeaders = new HttpHeaders();

        // Check if there's a next page
        if (productsPage.hasNext()) {
            URI nextUri = MvcUriComponentsBuilder
                    .fromMethodName(ProductResources.class, "getAllProducts", page + 1, size)
                    .build().toUri();

            // Set Link header with next page URL
            responseHeaders.add("Link", "<" + nextUri.toString() + ">; rel=\"next\"");
        }

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .body(productMapper.toProductsDto(productsPage.getContent()));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ProductDto>> getAllLatestProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productsPage = productService.findAllProducts(pageable);

        HttpHeaders responseHeaders = new HttpHeaders();

        // Check if there's a next page
        if (productsPage.hasNext()) {
            URI nextUri = MvcUriComponentsBuilder
                    .fromMethodName(ProductResources.class, "getAllProducts", page + 1, size)
                    .build().toUri();

            // Set Link header with next page URL
            responseHeaders.add("Link", "<" + nextUri.toString() + ">; rel=\"next\"");
        }

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .body(productMapper.toProductsDto(productsPage.getContent()));
    }

    @GetMapping("/location")
    public ResponseEntity<List<String>> getDistinctProductLocations() {
        List<String> distinctLocations = productService.findDistinctLocations();
        // return new ResponseEntity<>(productMapper.toProductsDto(distinctLocations),
        // HttpStatus.OK);
        // return ResponseEntity.ok(distinctLocations);
        return new ResponseEntity<>(distinctLocations, HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long id) {
        Product product = productService.findProductById(id);
        return new ResponseEntity<>(productMapper.toProductDto(product), HttpStatus.OK);
    }

    @GetMapping(params = "category")
    public ResponseEntity<List<ProductDto>> getAllProductByCategory(
            @RequestParam("category") String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortField,
            @RequestParam(value = "direction", defaultValue = "DESC") Sort.Direction direction) {

        Sort sort;
        if (direction == Sort.Direction.DESC) {
            sort = Sort.by(sortField).descending();
        } else {
            sort = Sort.by(sortField).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productsPage = productService.findAllProductsByCategory(category, pageable);

        HttpHeaders responseHeaders = new HttpHeaders();

        // Check if there's a next page
        if (productsPage.hasNext()) {
            URI nextUri = MvcUriComponentsBuilder
                    .fromMethodName(ProductResources.class, "getAllProductByCategory", category, page + 1, size,
                            sortField, direction)
                    .build().toUri();

            // Set Link header with next page URL
            responseHeaders.add("Link", "<" + nextUri.toString() + ">; rel=\"next\"");
        }

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .body(productMapper.toProductsDto(productsPage.getContent()));
    }

    // Getting pageresponse Dto from backend so that pagination is easy to implement
    // from the frontend
    @GetMapping(params = "categories")
    public ResponseEntity<PageResponse<ProductDto>> getProductsByCategory(
            @RequestParam("categories") String category,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productService.findAllProductsByCategory(category, pageable);

        List<ProductDto> productDtos = productMapper.toProductsDto(productsPage.getContent());
        PageResponse<ProductDto> response = new PageResponse<>(
                productDtos,
                productsPage.getNumber(),
                productsPage.getSize(),
                productsPage.getTotalElements(),
                productsPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Retrieve products associated with a user by their ID
    @GetMapping(params = "userId")
    public ResponseEntity<List<ProductDto>> getAllProductByUserId(@RequestParam("userId") Long userId) {
        List<Product> product = productService.getAllProductByUserId(userId);
        return new ResponseEntity<>(productMapper.toProductsDto(product), HttpStatus.OK);
    }

    // Add a new product
    @PostMapping
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto product) {
        ProductDto newProduct = productService.addProduct(product);
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED); // HttpStatus.CREATED (201) is more appropriate for
                                                                     // resource creation
    }
    // Adds the product to the loggedin user's favorite products list
    @PostMapping("/favorites")
    public ResponseEntity<FavoriteDto> addToFavorites(
        @RequestBody FavoriteDto favoriteDto
        ) 
        {
        try {
            FavoriteDto createdFavorite = favoriteProductService.addFavorites(favoriteDto);
            System.out.println("endpoint succeeded");
            return new ResponseEntity<>(createdFavorite, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Returns loggedin user's favorite product list
    @GetMapping("/favorites")
    public ResponseEntity<List<ProductDto>> getAllFavoriteProductsByUserId(
        @RequestParam("userId") Long userId) {
        List<ProductDto> favoriteProducts = favoriteProductService.getAllFavoriteProductsByUserId(userId);
        return new ResponseEntity<>((favoriteProducts), HttpStatus.OK);
    }

    // Checks whether a product is in requested user's favorite products or not
    @GetMapping("/favorites/check")
    public ResponseEntity<Boolean> getProductFavoriteStatus(
        @RequestParam("userId") Long userId,
        @RequestParam("productId") Long productId) {
        boolean productExistsInFavorites = favoriteProductService.isProductInFavorites(userId, productId);
        return new ResponseEntity<>((productExistsInFavorites), HttpStatus.OK);
        }

    // Deletes the product from user's favorite list with the userId and productId
    @DeleteMapping("/favorites")
        public ResponseEntity<Void> removeFromFavorites(
            @RequestBody FavoriteDto favoriteDto) {
                favoriteProductService.removeFromFavorites(favoriteDto);
                return new ResponseEntity<>(HttpStatus.OK);
            }

    // Get recommended products according loggedInUser's favorite list - top category
    @GetMapping("/recommended")
            public ResponseEntity<List<ProductDto>> getRecommendedProductsByUserFavorites(
                @RequestParam("userId") Long userId){
                    List<ProductDto> recommendedProducts = favoriteProductService.getRecommendedProducts(userId);
                    return new ResponseEntity<>(recommendedProducts, HttpStatus.OK);
            }

    // Delete a specific product by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProductById(id);
        return new ResponseEntity<>("Product deleted", HttpStatus.OK);
    }

    @GetMapping("/results")
    public List<ProductDto> getAllProducts(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {

        Specification<Product> spec = Specification.where(null);

        if (keyword != null) {
            spec = spec.or((root, query, builder) -> builder.like(root.get("title"), "%" + keyword + "%"));
            spec = spec.or((root, query, builder) -> builder.like(root.get("description"), "%" + keyword + "%"));
        }

        if (minPrice != null && maxPrice != null) {
            spec = spec.and((root, query, builder) -> builder.between(root.get("price"), minPrice, maxPrice));
        } else if (minPrice != null) {
            spec = spec.and((root, query, builder) -> builder.greaterThanOrEqualTo(root.get("price"), minPrice));
        } else if (maxPrice != null) {
            spec = spec.and((root, query, builder) -> builder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (location != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("location"), location));
        }

        if (category != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("category"), category));
        }

        Sort sortOption;
        if (sortBy != null) {
            Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;

            if ("price".equalsIgnoreCase(sortBy)) {
                // Sort by price
                sortOption = Sort.by(direction, "price");
            } else {
                // Handle other sorting options if needed
                sortOption = Sort.by(direction, "createdAt");
            }
        } else {
            // Default sorting by createdAt
            sortOption = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        List<ProductDto> productDtos = productService.getAllProductDtos(spec, sortOption);
        return productDtos;
    }

}
