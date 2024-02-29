package com.project3.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project3.backend.entities.Favorite;

@Repository
public interface FavoriteProductRepository extends JpaRepository<Favorite, Long> {

    // custom for deletion without the primary key id of the product
    Favorite findByUserIdAndProductId(Long userId, Long productId);

}
