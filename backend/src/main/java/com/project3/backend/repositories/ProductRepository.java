
package com.project3.backend.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project3.backend.dto.ProductDto;
import com.project3.backend.entities.Chat;
import com.project3.backend.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    void deleteProductById(Long id);

    Optional<Product> findProductById(Long id);

    Optional<List<Product>> findAllProductsByCategory(@Param("category") String category);

    Optional<List<Product>> findAllProductsByUserId(@Param("userId") Long userId);
    
    // retrieves all products that loggedin user favorited
    @Query("SELECT p FROM Product p " +
    "JOIN Favorite f ON p.id = f.product.id " +
    "WHERE f.user.id = :userId")
     List<Product> findAllFavoriteProductsByUserId(@Param("userId") Long userId);

    // retrieves recommended products according user's favorite list top categories - first one retrieves only top category
    //@Query(value="SELECT * FROM products p WHERE p.category = (SELECT p2.category from products p2 JOIN user_favorite_products f ON p2.id = f.product_id WHERE f.user_id = %:userId% GROUP BY p2.category ORDER BY COUNT(f.id) DESC LIMIT 1)" ,
    @Query(value= "WITH RankedCategories AS (SELECT p2.category, ROW_NUMBER() OVER (ORDER BY COUNT(f.id) DESC) AS rnk FROM products p2 JOIN user_favorite_products f ON p2.id = f.product_id WHERE f.user_id = ? GROUP BY p2.category) SELECT p.* FROM products p WHERE p.category IN ( SELECT category FROM RankedCategories WHERE rnk <= 3)",
        nativeQuery = true)
    List<Product> findAllProductsInTopCategoryOfUserFavorites(@Param("userId") Long userId);


    Page<Product> findAllProductsByCategory(String category, Pageable pageable);

    @Query("SELECT DISTINCT p.location FROM Product p")
    // List<String> getAllLocations();
    List<String> findDistinctLocations();


    @Query(
        value = "SELECT * FROM products p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword%",
        nativeQuery = true
    )
    List<Product> getProductsByTitleOrDescriptionContainingNative(String keyword); 
    

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Product> findByPriceGreaterThan(BigDecimal minPrice);

    List<Product> findByPriceLessThan(BigDecimal minPrice);

    List<Product> findAll(Specification<Product> spec, Sort sort);
}