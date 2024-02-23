package com.project3.backend.services;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import com.project3.backend.dto.EmailDto;
import com.project3.backend.entities.NewsLetter;
import com.project3.backend.repositories.NewsLetterRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsLetterService {

    @Autowired
    private NewsLetterRepository newsLetterRepository;

    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private JavaMailSender javaMailSender;

    public void subscribeNewsletter(EmailDto email) {

        NewsLetter newsLetterEntityExisting = newsLetterRepository.findByEmail(email.getEmail());
        if (newsLetterEntityExisting == null) {
            NewsLetter newsLetterEntity = new NewsLetter();
            newsLetterEntity.setEmail(email.getEmail());
            newsLetterRepository.save(newsLetterEntity);

            String htmlContent = readEmailTemplate("newsletterRegistration.html");
            htmlContent = htmlContent.replace("[EMAIL]", email.toString());
            try {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
                helper.setFrom("secondhandhub3@outlook.com");
                helper.setTo(email.getEmail());
                helper.setSubject("Newsletter");
                mimeMessage.setContent(htmlContent, "text/html");
                javaMailSender.send(mimeMessage);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }

    }

    public void unsubscribeNewsletter(EmailDto email) {
        NewsLetter newsLetterEntity = newsLetterRepository.findByEmail(email.getEmail());
        newsLetterRepository.delete(newsLetterEntity);
    }

    public String readEmailTemplate(String path) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + path);
            InputStream inputStream = resource.getInputStream();
            byte[] encoded = StreamUtils.copyToByteArray(inputStream);
            return new String(encoded, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // Handle exception
            e.printStackTrace();
            return "";
        }
    }

}
