package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.StatutReclamation;
import com.gestion.reclamation.backend.service.ClientService;
import com.gestion.reclamation.backend.service.ReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:4200"})
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<Reclamation>> getAllReclamations() {
        List<Reclamation> reclamations = reclamationService.getAllReclamations();
        if (reclamations.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(reclamations, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getReclamationById(@PathVariable Long id) {
        return reclamationService.getReclamationById(id)
                .map(reclamation -> new ResponseEntity<>(reclamation, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Reclamation> createReclamation(
            @RequestParam("clientId") Long clientId,
            @RequestParam("titre") String titre,
            @RequestParam("categorie") String categorie,
            @RequestParam("objet") String objet,
            @RequestParam("description") String description,
            @RequestParam(value = "fichierJoint", required = false) MultipartFile fichierJoint
    ) {
        try {
            Reclamation reclamation = new Reclamation();
            reclamation.setTitre(titre);
            reclamation.setCategorie(categorie);
            reclamation.setObjet(objet);
            reclamation.setDescription(description);
            reclamation.setDateCreation(LocalDateTime.now());
            reclamation.setStatut(StatutReclamation.NOUVELLE.toString());

            if (fichierJoint != null && !fichierJoint.isEmpty()) {
                String fileName = fichierJoint.getOriginalFilename();
                reclamation.setFichierJoint(fileName);
                // TODO: Gérer le stockage du fichier
            }

            Reclamation savedReclamation = reclamationService.createReclamation(clientId, reclamation);
            return new ResponseEntity<>(savedReclamation, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Reclamation> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            StatutReclamation statut = StatutReclamation.valueOf(newStatus);
            Reclamation updatedReclamation = reclamationService.updateStatus(id, statut);
            return ResponseEntity.ok(updatedReclamation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
