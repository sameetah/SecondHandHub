package com.project3.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project3.backend.entities.ChatMessage;
import com.project3.backend.entities.NewsLetter;

public interface NewsLetterRepository extends JpaRepository<NewsLetter, Long> {
    NewsLetter findByEmail(String email);
}
