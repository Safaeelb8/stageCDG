// src/main/java/com/gestion/reclamation/backend/controller/ReclamationController.java
package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.service.ReclamationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = {"http://localhost:4200","http://127.0.0.1:4200"})
@Validated
public class ReclamationController {

    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Création
    @PostMapping(
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ReclamationDto> createReclamation(
            @RequestParam("clientId") @NotNull Long clientId,
            @RequestParam("categorie") @NotBlank @Size(max = 255) String categorie,
            @RequestParam("objet") @NotBlank @Size(max = 100) String objet,
            @RequestParam("description") @NotBlank @Size(max = 1000) String description,
            @RequestPart(value = "fichierJoint", required = false) MultipartFile fichierJoint
    ) {
        Reclamation r = new Reclamation();
        r.setCategorie(categorie);
        r.setObjet(objet);
        r.setDescription(description);

        Reclamation saved = reclamationService.create(clientId, r, fichierJoint);

        URI location = URI.create("/api/reclamations/" + saved.getId());
        return ResponseEntity.created(location).body(ReclamationDto.from(saved));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Liste
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public List<ReclamationDto> list() {
        return reclamationService.findAll().stream()
                .map(ReclamationDto::from)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Détail
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly = true)
    public ReclamationDto get(@PathVariable Long id) {
        return reclamationService.findById(id)
                .map(ReclamationDto::from)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Réclamation introuvable"));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Pièce jointe (un seul fichier stocké sur l'entité)
    @GetMapping(path = "/{id}/file")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Reclamation r = reclamationService.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Réclamation introuvable"));

        byte[] data = r.getFileData();
        if (data == null || data.length == 0) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, "Aucun fichier joint");
        }

        MediaType type;
        try {
            type = (r.getFileType() != null && !r.getFileType().isBlank())
                    ? MediaType.parseMediaType(r.getFileType())
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception e) {
            type = MediaType.APPLICATION_OCTET_STREAM;
        }

        String filename = (r.getFileName() != null && !r.getFileName().isBlank()) ? r.getFileName() : "fichier";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(type);
        headers.setContentLength(data.length);
        headers.setContentDisposition(
                ContentDisposition.inline().filename(filename, StandardCharsets.UTF_8).build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Changer le statut (tolérant: query param OU body JSON)
    @PatchMapping(path = "/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ReclamationDto updateStatus(
            @PathVariable Long id,
            @RequestParam(value = "status", required = false) String statusParam,
            @RequestBody(required = false) Map<String, String> body,
            HttpServletRequest request
    ) {
        String raw = statusParam;
        if ((raw == null || raw.isBlank()) && body != null) raw = body.get("status");
        if ((raw == null || raw.isBlank())) raw = request.getParameter("status");

        System.out.println("[PATCH /reclamations/"+id+"/status] rawStatus=" + raw +
                " | Content-Type=" + request.getContentType());

        if (raw == null || raw.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "status manquant (attendu: NOUVELLE, EN_COURS, RESOLUE)"
            );
        }

        String norm = Normalizer.normalize(raw, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .trim()
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');

        if (norm.equals("ENCOURS")) norm = "EN_COURS";
        if (norm.equals("RESOLU"))  norm = "RESOLUE";

        final com.gestion.reclamation.backend.model.StatutReclamation newStatus;
        try {
            newStatus = com.gestion.reclamation.backend.model.StatutReclamation.valueOf(norm);
        } catch (IllegalArgumentException ex) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "status invalide (valeurs possibles: NOUVELLE, EN_COURS, RESOLUE) - reçu: "+raw
            );
        }

        return ReclamationDto.from(reclamationService.updateStatus(id, newStatus));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DTO local
    public record ReclamationDto(
            Long id, String objet, String description, String categorie, String statut,
            String dateCreation, Long clientId, String clientNom, String fileName, String fileType
    ) {
        public static ReclamationDto from(Reclamation r) {
            return new ReclamationDto(
                    r.getId(),
                    r.getObjet(),
                    r.getDescription(),
                    r.getCategorie(),
                    (r.getStatut() != null ? r.getStatut().name() : null),
                    (r.getDateCreation() != null ? r.getDateCreation().toString() : null),
                    (r.getClient() != null ? r.getClient().getId() : null),
                    (r.getClient() != null ? r.getClient().getNom() : null),
                    r.getFileName(),
                    r.getFileType()
            );
        }
    }
}
