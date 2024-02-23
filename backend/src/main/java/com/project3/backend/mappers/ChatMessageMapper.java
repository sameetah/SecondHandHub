package com.project3.backend.mappers;

import com.project3.backend.dto.ChatMessageDto;
import com.project3.backend.entities.ChatMessage;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ChatMessageMapper {

    @Mapping(source = "chat.id", target = "chatId")
    @Mapping(source = "sender", target = "sender")
    @Mapping(source = "sentTimestamp", target = "sentTimestampMillis")
    public abstract ChatMessageDto toChatMessageDto(ChatMessage chatMessage);

    @Mapping(target = "chat.id", source = "chatId")
    @Mapping(target = "sender", source = "sender")
    public abstract ChatMessage toChatMessage(ChatMessageDto chatMessageDto);

    public List<ChatMessageDto> toChatMessagesDto(List<ChatMessage> chatmessages) {
        return chatmessages.stream()
                .map(this::toChatMessageDto)
                .collect(Collectors.toList());
    }

}
