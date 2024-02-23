package com.project3.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.project3.backend.services.UserService;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig extends AbstractHttpConfigurer<SecurityConfig, HttpSecurity> {

        private final UserAuthProvider userAuthProvider;
        private final UserService userService;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(configurer -> {
                                        CorsConfiguration configuration = new CorsConfiguration();
                                        configuration.setAllowedOrigins(List.of("*"));
                                        configuration.setAllowedMethods(List.of("*"));
                                        configuration.setAllowedHeaders(List.of("*"));
                                        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                                        source.registerCorsConfiguration("/**", configuration);
                                        configurer.configurationSource(source);
                                })
                                .authorizeHttpRequests((requests) -> requests
                                                .requestMatchers(HttpMethod.DELETE, "/products/*", "products/favorites").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/newsletter").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/login", "/register",
                                                                "/reset", "/confirm",
                                                                "/newsletter", "/products/favorites")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/productImages*").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/products*", "/products/**",
                                                                "/products/results*",
                                                                "/products/results/*")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/users/*").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/users/*").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/ws-chat*", "/ws-chat/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(customizer -> customizer
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(new JwtAuthFilter(userAuthProvider, userService),
                                                BasicAuthenticationFilter.class);

                return http.build();
        }
}
