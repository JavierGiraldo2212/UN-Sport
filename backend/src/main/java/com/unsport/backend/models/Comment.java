package com.unsport.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Profile author;

    @ManyToOne
    @JoinColumn(name = "announcement_id")
    @JsonIgnore
    private Announcement announcement;

    // --- RELACIONES JERÁRQUICAS ---

    // El Padre (Lo ignoramos en el JSON para evitar ciclos, pero usamos su ID abajo)
    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore 
    private Comment parent;

    // Las Respuestas (Esta es la lista que te faltaba o estaba vacía)
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("createdAt ASC")
    private List<Comment> replies;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    // --- CAMPO CALCULADO PARA EL FRONTEND ---
    // Esto es lo que permite que el filtro !parentId funcione
    @JsonProperty("parentId")
    public Long getParentId() {
        return parent != null ? parent.getId() : null;
    }
}