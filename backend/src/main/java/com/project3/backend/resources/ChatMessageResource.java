package com.project3.backend.resources;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.project3.backend.dto.ChatMessageDto;
import com.project3.backend.entities.ChatMessage;
import com.project3.backend.mappers.ChatMessageMapper;
import com.project3.backend.services.ChatMessageService;

@RestController
@RequestMapping(value = "/chatMessages")
public class ChatMessageResource {
    private final ChatMessageService chatMessageService;
    private final ChatMessageMapper chatMessageMapper;

    public ChatMessageResource(ChatMessageService chatMessageService, ChatMessageMapper chatMessageMapper) {
        this.chatMessageService = chatMessageService;
        this.chatMessageMapper = chatMessageMapper;
    }

    @GetMapping(params = "chatId")
    public ResponseEntity<List<ChatMessageDto>> getAllChatMessages(
            @RequestParam("chatId") Long chatId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("sentTimestamp").descending());
        Page<ChatMessage> chatMessagesPage = chatMessageService.findAllChatMessagesByChatId(chatId, pageable);

        HttpHeaders responseHeaders = new HttpHeaders();

        // Check if there's a next page (in our case, previous messages since we're
        // ordering newest first)
        if (chatMessagesPage.hasNext()) {
            URI nextUri = MvcUriComponentsBuilder
                    .fromMethodName(ChatMessageResource.class, "getAllChatMessages", chatId, page + 1, size)
                    .build().toUri();

            // Set Link header with next page URL
            responseHeaders.add("Link", "<" + nextUri.toString() + ">; rel=\"next\"");
        }

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .body(chatMessageMapper.toChatMessagesDto(chatMessagesPage.getContent()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatMessageDto> getChatMessageById(@PathVariable("id") Long id) {
        ChatMessage chatMessage = chatMessageService.findChatMessageById(id);
        return new ResponseEntity<>(chatMessageMapper.toChatMessageDto(chatMessage), HttpStatus.OK);
    }

    @PostMapping // Change from PUT to POST for creation
    public ResponseEntity<ChatMessageDto> createChatMessage(@RequestBody ChatMessageDto chatMessage) {
        ChatMessageDto newChatMessage = chatMessageService.addChatMessage(chatMessage);
        return new ResponseEntity<>(newChatMessage, HttpStatus.CREATED); // 201 Created for new entities
    }
}
