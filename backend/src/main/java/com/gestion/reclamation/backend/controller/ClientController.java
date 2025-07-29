package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.service.ReclamationService;
import com.gestion.reclamation.backend.service.ReponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired
    private ReclamationService reclamationService;

    @Autowired
    private ReponseService reponseService;

    // ➕ Créer une réclamation
    @PostMapping("/{clientId}/reclamations")
    public Reclamation createReclamation(@PathVariable Long clientId, @RequestBody Reclamation reclamation) {
        return reclamationService.createReclamation(clientId, reclamation);
    }

    // 📋 Lister les réclamations du client
    @GetMapping("/{clientId}/reclamations")
    public List<Reclamation> getReclamations(@PathVariable Long clientId) {
        return reclamationService.getReclamationsByClient(clientId);
    }

    // 👀 Voir les réponses à une réclamation
    @GetMapping("/reclamations/{reclamationId}/reponses")
    public List<Reponse> getReponses(@PathVariable Long reclamationId) {
        return reponseService.getReponsesByReclamation(reclamationId);
    }
}
