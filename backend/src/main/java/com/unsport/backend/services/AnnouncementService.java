package com.unsport.backend.services;

import com.unsport.backend.models.Announcement;
import com.unsport.backend.models.Profile;
import com.unsport.backend.repositories.AnnouncementRepository;
import com.unsport.backend.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ProfileRepository profileRepository;

    // Obtener todos los anuncios
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    // Crear un anuncio nuevo (validando que el autor exista)
    public Announcement createAnnouncement(String title, String content, UUID authorId) {
        Profile author = profileRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        // Opcional: Aquí podrías agregar un if(author.getRole().getNombre().equals("ENTRENADOR")) 
        // para asegurar en el backend que solo entrenadores publiquen.

        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setAuthor(author);

        return announcementRepository.save(announcement);
    }
}