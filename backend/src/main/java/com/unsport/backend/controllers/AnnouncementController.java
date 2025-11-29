package com.unsport.backend.controllers;

import com.unsport.backend.models.Announcement;
import com.unsport.backend.services.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private com.unsport.backend.repositories.CommentRepository commentRepository;
    @Autowired
    private com.unsport.backend.repositories.ProfileRepository profileRepository;
    @Autowired
    private com.unsport.backend.repositories.AnnouncementRepository announcementRepository;

    @GetMapping
    public List<Announcement> getAll() {
        return announcementService.getAllAnnouncements();
    }

    @PostMapping
    public Announcement create(@RequestBody Map<String, String> payload) {
        // Esperamos un JSON con: title, content, authorId
        String title = payload.get("title");
        String content = payload.get("content");
        String authorIdStr = payload.get("authorId");

        return announcementService.createAnnouncement(title, content, UUID.fromString(authorIdStr));
    }

    @PostMapping("/{id}/comments")
    public com.unsport.backend.models.Comment addComment(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        
        String content = payload.get("content");
        String authorIdStr = payload.get("authorId");

        // Buscar el anuncio
        com.unsport.backend.models.Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        // Buscar el autor
        com.unsport.backend.models.Profile author = profileRepository.findById(UUID.fromString(authorIdStr))
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        // Crear comentario
        com.unsport.backend.models.Comment comment = new com.unsport.backend.models.Comment();
        comment.setContent(content);
        comment.setAnnouncement(announcement);
        comment.setAuthor(author);

        return commentRepository.save(comment);
    }

    // Endpoint para RESPONDER A UN COMENTARIO
    @PostMapping("/comments/{commentId}/reply")
    public com.unsport.backend.models.Comment replyToComment(
            @PathVariable Long commentId, 
            @RequestBody Map<String, String> payload) {
        
        String content = payload.get("content");
        String authorIdStr = payload.get("authorId");

        // 1. Buscar el comentario padre
        com.unsport.backend.models.Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentario padre no encontrado"));

        // 2. Buscar el autor
        com.unsport.backend.models.Profile author = profileRepository.findById(UUID.fromString(authorIdStr))
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));

        // 3. Crear la respuesta
        com.unsport.backend.models.Comment reply = new com.unsport.backend.models.Comment();
        reply.setContent(content);
        reply.setAuthor(author);
        reply.setParent(parentComment);
        // Importante: La respuesta pertenece al mismo anuncio que el padre
        reply.setAnnouncement(parentComment.getAnnouncement());

        return commentRepository.save(reply);
    }
}