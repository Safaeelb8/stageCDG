// src/main/java/com/gestion/reclamation/backend/service/ReclamationService.java
package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.StatutReclamation;
import com.gestion.reclamation.backend.model.UserAccount;
import com.gestion.reclamation.backend.repository.ClientRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import com.gestion.reclamation.backend.repository.UserAccountRepository;
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
    private final UserAccountRepository userAccountRepository;

    public ReclamationService(ReclamationRepository reclamationRepository,
                              ClientRepository clientRepository,
                              UserAccountRepository userAccountRepository) {
        this.reclamationRepository = reclamationRepository;
        this.clientRepository = clientRepository;
        this.userAccountRepository = userAccountRepository;
    }

    /** Sélecteur: d'abord client.id, sinon user_account.id → client lié (créé si absent) */
    private Client resolveClientBySelector(Long selectorId) {
        // 1) client.id direct (compat)
        Optional<Client> direct = clientRepository.findById(selectorId);
        if (direct.isPresent()) return direct.get();

        // 2) user_account.id (sélecteur venant du front = auth.me.userId)
        UserAccount ua = userAccountRepository.findById(selectorId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client introuvable"));

        // ⛔ rôle incompatible
        if (ua.getRole() != com.gestion.reclamation.backend.model.Role.CLIENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Rôle incompatible: CLIENT attendu");
        }

        // 3) crée/retourne le Client rattaché à cet email (modèle actuel)
        return clientRepository.findByEmail(ua.getEmail()).orElseGet(() -> {
            Client c = new Client();
            c.setEmail(ua.getEmail());
            c.setNom(ua.getNom());
            return clientRepository.save(c);
        });
    }

    @Transactional
    public Reclamation create(Long clientSelectorId, Reclamation r, MultipartFile fichierJoint) {
        if (clientSelectorId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "clientId est obligatoire");
        }

        Client client = resolveClientBySelector(clientSelectorId);

        if (fichierJoint != null && !fichierJoint.isEmpty()) {
            try {
                r.setFileName(fichierJoint.getOriginalFilename());
                r.setFileType(fichierJoint.getContentType());
                r.setFileData(fichierJoint.getBytes());
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier joint invalide");
            }
        }

        if (r.getStatut() == null) r.setStatut(StatutReclamation.NOUVELLE);
        if (r.getDateCreation() == null) r.setDateCreation(LocalDateTime.now());
        r.setClient(client);

        try {
            return reclamationRepository.save(r);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Données invalides: " + ex.getMostSpecificCause().getMessage()
            );
        }
    }

    @Transactional(readOnly = true)
    public List<Reclamation> findAll() {
        return reclamationRepository.findAll();
    }

    @Transactional
    public List<Reclamation> getByClientSelector(Long selectorId) {
        Client c = resolveClientBySelector(selectorId);
        return reclamationRepository.findByClient_Id(c.getId());
    }

    @Transactional(readOnly = true)
    public Optional<Reclamation> findById(Long id) {
        return reclamationRepository.findById(id);
    }

    @Transactional
    public Reclamation updateStatus(Long id, StatutReclamation newStatus) {
        Reclamation r = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réclamation introuvable"));
        r.setStatut(newStatus);
        return reclamationRepository.save(r);
    }
}
