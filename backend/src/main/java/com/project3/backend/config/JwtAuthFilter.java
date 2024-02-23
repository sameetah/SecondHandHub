package com.project3.backend.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.project3.backend.dto.UserDto;
import com.project3.backend.exceptions.InvalidTokenException;
import com.project3.backend.services.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final UserAuthProvider userAuthProvider;
    private final UserService userService; // Marked as final

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String[] authElements = null;

        String requestURI = request.getRequestURI();
        if (isExcluded(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.info("Processing request to {}", request.getRequestURI());

        try {
            if (header != null) {
                logger.info("Authorization header found: {}", header);
                authElements = header.split(" ");

                if (authElements.length == 2 && "Bearer".equals(authElements[0])) {
                    if ("GET".equalsIgnoreCase(request.getMethod())) {
                        logger.info("Validating token for GET request");
                        SecurityContextHolder.getContext()
                                .setAuthentication(userAuthProvider.validateToken(authElements[1]));
                    } else {
                        logger.info("Strongly validating token for non-GET request");
                        SecurityContextHolder.getContext()
                                .setAuthentication(userAuthProvider.validateTokenStrongly(authElements[1]));
                    }
                } else {
                    logger.warn("Invalid format for Authorization header");
                }
            } else {
                logger.warn("No Authorization header found");
            }

            filterChain.doFilter(request, response);

        } catch (TokenExpiredException e) {
            logger.error("Token has expired: {}", e.getMessage());

            if (authElements != null && authElements.length > 1) {
                DecodedJWT decoded = JWT.decode(authElements[1]);
                String userLogin = decoded.getIssuer();

                UserDto user = userService.findByLogin(userLogin);

                String newToken = userAuthProvider.createToken(user);

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter()
                        .write("{\"error\": \"Token has expired.\", \"newToken\": \"" + newToken + "\"}");
                System.out.println(newToken);
            }

        } catch (InvalidTokenException e) {
            logger.error("Invalid token: {}", e.getMessage());
            SecurityContextHolder.clearContext();

            if (authElements != null && authElements.length > 1) {
                DecodedJWT decoded = JWT.decode(authElements[1]);
                String userLogin = decoded.getIssuer();

                UserDto user = userService.findByLogin(userLogin);

                String newToken = userAuthProvider.createToken(user);

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter()
                        .write("{\"error\": \"" + e.getMessage() + "\", \"newToken\": \"" + newToken + "\"}");
            }

        } catch (RuntimeException e) {
            logger.error("An error occurred processing the token: ", e);
            SecurityContextHolder.clearContext();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"An error occurred processing the token.\"}");
        }
    }

    private boolean isExcluded(String requestURI) {
        List<String> excludedUrls = Arrays.asList("/api/login", "/api/register", "/api/products*", "/api/reset",
                "/api/confirm", "/api/ws-chat", "api/ws-chat*", "api/ws-chat/*");
        return excludedUrls.contains(requestURI);
    }
}
