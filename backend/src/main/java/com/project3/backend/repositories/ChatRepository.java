
package com.project3.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project3.backend.entities.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    void deleteChatById(Long id);

    Optional<List<Chat>> findAllChatByProductId(Long id);

    Optional<Chat> findChatById(Long id);

    @Query("SELECT c FROM Chat c WHERE c.user1.id = :userId OR c.user2.id = :userId")
    Optional<List<Chat>> findAllChatByUserId(@Param("userId") Long userId);

}
