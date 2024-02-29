package com.project3.backend.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.ChatDto;
import com.project3.backend.entities.Chat;
import com.project3.backend.exceptions.AppException;
import com.project3.backend.mappers.ChatMapper;
import com.project3.backend.repositories.ChatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;

    public List<Chat> findAllChats() {
        return chatRepository.findAll();
    }

    public List<Chat> findAllChatsByUserId(Long userId) {
        return chatRepository.findAllChatByUserId(userId)
                .orElseThrow(() -> new AppException("No Chat messages", HttpStatus.NOT_FOUND));

    }

    public Chat findChatById(Long id) {
        return chatRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    public ChatDto addChat(ChatDto chat) {
        Chat saveChat = chatRepository.save(chatMapper.toChat(chat));
        return chatMapper.toChatDto(saveChat);
    }

}
