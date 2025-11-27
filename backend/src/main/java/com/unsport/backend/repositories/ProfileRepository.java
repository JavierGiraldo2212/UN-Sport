package com.unsport.backend.repositories;

import com.unsport.backend.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    // Spring crea automáticamente la consulta para buscar por email si agregaras ese campo,
    // pero como usamos el ID de Supabase, con findById nos basta por ahora.
}