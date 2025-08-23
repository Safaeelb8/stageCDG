package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.service.ReponseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reponses")
@CrossOrigin(origins = "http://localhost:4200")
public class ReponseController {

    private final ReponseService service;

    public ReponseController(ReponseService service) {
        this.service = service;
    }

    // POST /api/reponses/reclamation/{reclamationId}/agent/{agentId}
    @PostMapping("/reclamation/{reclamationId}/agent/{agentId}")
    public ResponseEntity<Reponse> addWithAgent(
            @PathVariable Long reclamationId,
            @PathVariable Long agentId,
            @RequestBody ReponseRequest body
    ) {
        Reponse saved = service.add(reclamationId, agentId, body.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // POST /api/reponses/reclamation/{reclamationId}  (agent optionnel non fourni)
    @PostMapping("/reclamation/{reclamationId}")
    public ResponseEntity<Reponse> addWithoutAgent(
            @PathVariable Long reclamationId,
            @RequestBody ReponseRequest body
    ) {
        Reponse saved = service.add(reclamationId, null, body.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/reponses/reclamation/{reclamationId}
    @GetMapping("/reclamation/{reclamationId}")
    public ResponseEntity<Iterable<Reponse>> listByReclamation(@PathVariable Long reclamationId) {
        return ResponseEntity.ok(service.listByReclamation(reclamationId));
    }

    // DTO pour le corps de la requête
    public static class ReponseRequest {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
