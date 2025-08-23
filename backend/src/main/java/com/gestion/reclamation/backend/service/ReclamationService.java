package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.StatutReclamation;
import com.gestion.reclamation.backend.repository.ClientRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ClientRepository clientRepository;

    public ReclamationService(ReclamationRepository reclamationRepository,
                              ClientRepository clientRepository) {
        this.reclamationRepository = reclamationRepository;
        this.clientRepository = clientRepository;
    }

    @Transactional
    public Reclamation create(Long clientId, Reclamation r, MultipartFile fichierJoint) {
        if (clientId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "clientId est obligatoire");
        }

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client introuvable"));

        // Fichier (optionnel)
        if (fichierJoint != null && !fichierJoint.isEmpty()) {
            try {
                r.setFileName(fichierJoint.getOriginalFilename());
                r.setFileType(fichierJoint.getContentType());
                r.setFileData(fichierJoint.getBytes());
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier joint invalide");
            }
        }

        // Initialisation champs
        if (r.getStatut() == null) r.setStatut(StatutReclamation.NOUVELLE);
        if (r.getDateCreation() == null) r.setDateCreation(LocalDateTime.now());
        r.setClient(client);

        try {
            return reclamationRepository.save(r);
        } catch (DataIntegrityViolationException ex) {
            // typiquement: description > 1000, etc.
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Données invalides: " + ex.getMostSpecificCause().getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<Reclamation> findAll() {
        return reclamationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Reclamation> findById(Long id) {
        return reclamationRepository.findById(id);
    }

    @Transactional
    public Reclamation updateStatus(Long id, com.gestion.reclamation.backend.model.StatutReclamation newStatus) {
        Reclamation r = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réclamation introuvable"));
        r.setStatut(newStatus);
        return reclamationRepository.save(r);
    }

    // Laisser au besoin
    @Transactional(readOnly = true)
    public List<Reclamation> getAll() { return reclamationRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Reclamation> getByClient(Long clientId) {
        return reclamationRepository.findByClientId(clientId);
    }
}
