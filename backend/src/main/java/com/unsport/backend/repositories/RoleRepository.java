package com.unsport.backend.repositories;

import com.unsport.backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Método extra para buscar roles por nombre fácilmente (ej: buscar "ENTRENADOR")
    Optional<Role> findByNombre(String nombre);
}