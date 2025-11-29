package com.unsport.backend.repositories;

import com.unsport.backend.models.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Método para obtener los anuncios ordenados por fecha (el más nuevo primero)
    List<Announcement> findAllByOrderByCreatedAtDesc();
}