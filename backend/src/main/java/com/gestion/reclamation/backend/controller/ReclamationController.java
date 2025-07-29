package com.gestion.reclamation.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.repository.ReclamationRepository;

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
	        @RequestPart(value = "fichierJoint", required = false) MultipartFile fichier
	    ) {
	        Reclamation reclamation = new Reclamation();
	        reclamation.setTitre(objet);
	        reclamation.setDescription(description);
	        reclamation.setStatut(categorie);
	        reclamation.setDateCreation(LocalDateTime.now());

	        // (optionnel) Sauvegarder fichier si tu veux
	        // TODO : fichier.getBytes(), fichier.getOriginalFilename()

	        reclamationRepository.save(reclamation);
	        return ResponseEntity.ok(Map.of("message", "Réclamation enregistrée !"));
	    }
	}


