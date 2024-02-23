package com.project3.backend.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.project3.backend.dto.ChatMessageDto;
import com.project3.backend.entities.ChatMessage;
import com.project3.backend.exceptions.AppException;
import com.project3.backend.mappers.ChatMapper;
import com.project3.backend.mappers.ChatMessageMapper;
import com.project3.backend.repositories.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;

    public ChatMessage findChatMessageById(Long id) {
        return chatMessageRepository.findById(id)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
    }

    public Page<ChatMessage> findAllChatMessagesByChatId(Long chatId, Pageable pageable) {
        return chatMessageRepository.findAllByChat_Id(chatId, pageable)
                .orElseThrow(() -> new AppException("No Chat messages", HttpStatus.NOT_FOUND));
    }

    public ChatMessageDto addChatMessage(ChatMessageDto chatMessage) {
        ChatMessage saveChatMessage = chatMessageRepository.save(chatMessageMapper.toChatMessage(chatMessage));
        return chatMessageMapper.toChatMessageDto(saveChatMessage);
    }

}
