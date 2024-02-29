package com.project3.backend.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.project3.backend.dto.SignupDto;
import com.project3.backend.dto.UserDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    UserDtoSecure toUsersDtoSecure(User user);

    default List<UserDtoSecure> toUsersDtoSecure(List<User> users) {
        return users.stream()
                .map(this::toUsersDtoSecure)
                .collect(Collectors.toList());
    }

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignupDto signupDto);

}
