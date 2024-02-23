
package com.project3.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project3.backend.entities.ProductImages;

public interface ProductImagesRepository extends JpaRepository<ProductImages, Long> {

    void deleteProductImagesById(Long id);

    Optional<ProductImages> findProductImagesById(Long id);

    Optional<List<ProductImages>> findAllProductImagesByProductId(Long productId);

}
