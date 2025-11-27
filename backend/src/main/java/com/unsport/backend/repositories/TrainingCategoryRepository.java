package com.unsport.backend.repositories;

import com.unsport.backend.models.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Long> {
    // Aquí podrías agregar búsquedas específicas si las necesitas en el futuro
}