package com.project3.backend.resources;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project3.backend.dto.ChatDto;
import com.project3.backend.dto.ChatMessageDto;
import com.project3.backend.entities.Chat;
import com.project3.backend.mappers.ChatMapper;
import com.project3.backend.services.ChatMessageService;
import com.project3.backend.services.ChatService;

@RestController
@RequestMapping(value = "/chats")
public class ChatResources {
    private final ChatService chatService;
    private final ChatMapper chatMapper;
    private final ChatMessageService chatMessageService;

    public ChatResources(ChatService chatService, ChatMapper chatMapper, ChatMessageService chatMessageService) {
        this.chatService = chatService;
        this.chatMapper = chatMapper;
        this.chatMessageService = chatMessageService;
    }

    @GetMapping
    public ResponseEntity<List<Chat>> getAllChats() {
        List<Chat> chats = chatService.findAllChats();
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<List<ChatDto>> getChatsByUserId(@RequestParam("userId") Long id) {
        List<Chat> chats = chatService.findAllChatsByUserId(id);
        return new ResponseEntity<>(chatMapper.toChatsDto(chats), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDto> getChatById(@PathVariable("id") Long id) {
        Chat chat = chatService.findChatById(id);
        return new ResponseEntity<>(chatMapper.toChatDto(chat), HttpStatus.OK);
    }

    @PostMapping // Change from PUT to POST for creation
    public ResponseEntity<ChatDto> createChat(@RequestBody ChatDto chat) {
        ChatDto newChat = chatService.addChat(chat);
        return new ResponseEntity<>(newChat, HttpStatus.CREATED); // Changed status to 201 Created
    }

    @MessageMapping("/chat/{chatId}/sendMessage")
    @SendTo("/topic/chat/{chatId}")
    public ChatMessageDto sendMessageToChat(@DestinationVariable String chatId, ChatMessageDto chatMessage) {
        System.out.println(chatMessage);
        chatMessageService.addChatMessage(chatMessage);
        return chatMessage;
    }

}
