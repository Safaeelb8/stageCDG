package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "http://localhost:4200")
public class ReclamationController {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> ajouterReclamation(
            @RequestParam("categorie") String categorie,
            @RequestParam("objet") String objet,
            @RequestParam("description") String description,
            @RequestParam(value = "fichierJoint", required = false) MultipartFile fichier
    ) {
        Reclamation reclamation = new Reclamation();

        reclamation.setCategorie(categorie);
        reclamation.setObjet(objet);
        reclamation.setDescription(description);
        reclamation.setTitre(objet); // ou setTitre("Réclamation - " + categorie)
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setStatut("NOUVELLE"); // statut initial

        // Gérer le fichier joint (sauvegarde du nom dans la BDD)
        if (fichier != null && !fichier.isEmpty()) {
            reclamation.setFichierJoint(fichier.getOriginalFilename());

            // 👉 Optionnel : stocker le fichier sur le disque
            // Path path = Paths.get("uploads/" + fichier.getOriginalFilename());
            // Files.copy(fichier.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        }

        reclamationRepository.save(reclamation);

        return ResponseEntity.ok(Map.of("message", "Réclamation enregistrée avec succès."));
    }
}
