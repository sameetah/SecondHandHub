package com.project3.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "app_user1")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(name = "first_Name", nullable = false)
    private String firstName;

    @Column(name = "second_Name", nullable = false)
    private String secondName;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String password;
    private String imageUrl;

    @Column(name = "joined", updatable = false)
    @CreationTimestamp
    private LocalDateTime joined;

    public User(String firstName, String secondName) {
        this.firstName = firstName;
        this.secondName = secondName;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", secondName='" + secondName + '\'' +
                ", joined=" + joined.toString() +
                '}';
    }

}
