package com.project3.backend.mappers;

import com.project3.backend.dto.ChatDto;
import com.project3.backend.dto.UserDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.Chat;
import com.project3.backend.entities.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import com.project3.backend.repositories.UserRepository;
import com.project3.backend.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = { UserMapper.class, UserRepository.class })
public abstract class ChatMapper {
    @Autowired
    private UserService userService;
    @Autowired
    protected UserMapper userMapper;

    // From Chat to ChatDto
    @Mapping(source = "user1", target = "user1", qualifiedByName = "mapUserToDto")
    @Mapping(source = "user2", target = "user2", qualifiedByName = "mapUserToDto")
    public abstract ChatDto toChatDto(Chat chat);

    // From ChatDto to Chat
    @Mapping(source = "user1", target = "user1", qualifiedByName = "mapUserFromDto")
    @Mapping(source = "user2", target = "user2", qualifiedByName = "mapUserFromDto")
    public abstract Chat toChat(ChatDto chatDto);

    @Named("mapUserToDto")
    protected UserDtoSecure mapUserToDto(User user) {
        return userMapper.toUsersDtoSecure(user);
    }

    @Named("mapUserFromDto")
    protected User mapUserFromDto(UserDtoSecure userDto) {
        // Assuming you have a method in your service to fetch User by DTO.
        return userService.findUserById(userDto.getId());
    }

    public List<ChatDto> toChatsDto(List<Chat> chats) {
        return chats.stream()
                .map(this::toChatDto)
                .collect(Collectors.toList());
    }
}
