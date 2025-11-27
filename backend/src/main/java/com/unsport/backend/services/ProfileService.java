package com.unsport.backend.services;

import com.unsport.backend.models.Profile;
import com.unsport.backend.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // Obtener todos los usuarios (para que el entrenador vea su lista)
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    // Aquí agregaremos más lógica luego, como "buscar solo atletas", "asignar rutina", etc.
}