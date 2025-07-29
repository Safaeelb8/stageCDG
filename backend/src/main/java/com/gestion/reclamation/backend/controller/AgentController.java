package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.service.ReclamationService;
import com.gestion.reclamation.backend.service.ReponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "http://localhost:4200")
public class AgentController {

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private ReponseService reponseService;

    // 📋 Lister toutes les réclamations
    @GetMapping("/reclamations")
    public List<Reclamation> getAllReclamations() {
        return reclamationService.getAllReclamations();
    }

    // ➕ Ajouter une réponse à une réclamation
    @PostMapping("/reclamations/{reclamationId}/repondre")
    public Reponse ajouterReponse(
            @PathVariable Long reclamationId,
            @RequestParam Long agentId,
            @RequestBody String message) {
        return reponseService.ajouterReponse(reclamationId, agentId, message);
    }
}
