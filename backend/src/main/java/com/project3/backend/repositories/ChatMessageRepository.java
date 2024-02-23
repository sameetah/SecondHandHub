
package com.project3.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project3.backend.entities.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    void deleteMessageById(Long id);

    Optional<ChatMessage> findMessageById(Long id);

    Optional<Page<ChatMessage>> findAllByChat_Id(Long chatId, Pageable pageable);
}
