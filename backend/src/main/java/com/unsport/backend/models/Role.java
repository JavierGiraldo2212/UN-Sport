package com.unsport.backend.models;

import jakarta.persistence.*;
import lombok.Data; // Usamos Lombok para no escribir getters/setters manuales

@Data
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;
}