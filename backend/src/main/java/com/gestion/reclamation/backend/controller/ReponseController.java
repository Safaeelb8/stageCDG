// src/main/java/com/gestion/reclamation/backend/controller/ReponseController.java
package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.service.ReponseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reponses")
@CrossOrigin(origins = "http://localhost:4200")
public class ReponseController {

    private final ReponseService service;

    public ReponseController(ReponseService service) {
        this.service = service;
    }

    // POST (inchangé)
    @PostMapping("/reclamation/{reclamationId}/agent/{agentId}")
    public ResponseEntity<Reponse> addWithAgent(
            @PathVariable Long reclamationId,
            @PathVariable Long agentId,
            @RequestBody ReponseRequest body
    ) {
        Reponse saved = service.add(reclamationId, agentId, body.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/reclamation/{reclamationId}")
    public ResponseEntity<Reponse> addWithoutAgent(
            @PathVariable Long reclamationId,
            @RequestBody ReponseRequest body
    ) {
        Reponse saved = service.add(reclamationId, null, body.getMessage());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ GET: renvoie des DTO (pas les entités JPA)
    @GetMapping("/reclamation/{reclamationId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ReponseDto>> listByReclamation(@PathVariable Long reclamationId) {
        var list = service.listByReclamation(reclamationId); // aucune 404 ici : [] si rien
        var out = list.stream().map(ReponseDto::from).toList();
        return ResponseEntity.ok(out);
    }

    public static class ReponseRequest {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    // -------- DTOs utilisés par le front --------
    public record AgentMini(Long id, String nom, String prenom) {}

    public record ReponseDto(
            Long id,
            String message,
            String dateReponse,    // ISO-8601 string
            AgentMini agent        // peut être null
    ) {
        private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        public static ReponseDto from(Reponse r) {
            AgentMini a = null;
            if (r.getAgent() != null) {
                // prenom inconnu dans ton modèle Agent -> null
                a = new AgentMini(r.getAgent().getId(), r.getAgent().getNom(), null);
            }
            String date = (r.getDateReponse() != null) ? r.getDateReponse().format(ISO) : null;
            return new ReponseDto(r.getId(), r.getMessage(), date, a);
        }
    }
}
