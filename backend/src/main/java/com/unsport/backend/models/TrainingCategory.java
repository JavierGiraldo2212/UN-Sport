package com.unsport.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "training_categories")
public class TrainingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modalidad; // Ej: Velocidad

    @Column(name = "sub_categoria")
    private String subCategoria; // Ej: 100-200m
}