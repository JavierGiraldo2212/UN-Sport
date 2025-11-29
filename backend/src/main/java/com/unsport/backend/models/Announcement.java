package com.unsport.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Relación con el autor (Entrenador)
    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Profile author;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    // Relación Uno a Muchos: Un anuncio tiene muchos comentarios
    @OneToMany(mappedBy = "announcement", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("createdAt ASC") // Los comentarios más viejos primero (estilo chat/reddit)
    private java.util.List<Comment> comments;
}