package com.project3.backend.mappers;

import com.project3.backend.dto.ProductDto;
import com.project3.backend.dto.UserDtoSecure;
import com.project3.backend.entities.Product;
import com.project3.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import com.project3.backend.repositories.UserRepository;
import com.project3.backend.services.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = UserRepository.class)
public abstract class ProductMapper {
    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected UserService userService;

    @Autowired
    protected UserMapper userMapper;

    @Mapping(source = "user", target = "user", qualifiedByName = "toUsersDtoSecure")
    public abstract ProductDto toProductDto(Product product);

    @Mapping(target = "user", source = "user")
    public abstract Product toProduct(ProductDto productDto);

    @Named("toUsersDtoSecure")
    public UserDtoSecure toUserDtoSecure(User user) {
        return userMapper.toUsersDtoSecure(user);
    }

    public List<ProductDto> toProductsDto(List<Product> products) {
        return products.stream()
                .map(this::toProductDto)
                .collect(Collectors.toList());
    }
}
