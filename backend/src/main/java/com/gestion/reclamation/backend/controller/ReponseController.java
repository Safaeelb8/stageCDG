package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.service.ReponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:4200", "http://localhost:49217"})
public class ReponseController {

    @Autowired
    private ReponseService reponseService;

    @PostMapping("/reclamation/{reclamationId}/agent/{agentId}")
    public ResponseEntity<Reponse> ajouterReponse(
            @PathVariable Long reclamationId,
            @PathVariable Long agentId,
            @RequestBody String message) {
        try {
            Reponse reponse = reponseService.ajouterReponse(reclamationId, agentId, message);
            return ResponseEntity.ok(reponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/reclamation/{reclamationId}")
    public ResponseEntity<List<Reponse>> getReponsesByReclamation(@PathVariable Long reclamationId) {
        List<Reponse> reponses = reponseService.getReponsesByReclamation(reclamationId);
        return ResponseEntity.ok(reponses);
    }
} 