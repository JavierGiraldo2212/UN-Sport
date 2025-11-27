package com.unsport.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @Column(name = "id")
    private UUID id; // Este ID debe coincidir con el ID de autenticación de Supabase

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    // Relación Muchos a Uno con Roles (Un rol lo tienen muchos perfiles)
    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role;

    // Relación Muchos a Uno con Categorías (Muchos atletas pueden tener la misma categoría)
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private TrainingCategory trainingCategory;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}