// src/main/java/com/gestion/reclamation/backend/service/ReponseService.java
package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.model.UserAccount;
import com.gestion.reclamation.backend.repository.AgentRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import com.gestion.reclamation.backend.repository.ReponseRepository;
import com.gestion.reclamation.backend.repository.UserAccountRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReponseService {

    private final ReponseRepository reponseRepository;
    private final ReclamationRepository reclamationRepository;
    private final AgentRepository agentRepository;
    private final UserAccountRepository userAccountRepository;

    public ReponseService(ReponseRepository reponseRepository,
                          ReclamationRepository reclamationRepository,
                          AgentRepository agentRepository,
                          UserAccountRepository userAccountRepository) {
        this.reponseRepository = reponseRepository;
        this.reclamationRepository = reclamationRepository;
        this.agentRepository = agentRepository;
        this.userAccountRepository = userAccountRepository;
    }

    /** Sélecteur: d'abord agent.id, sinon user_account.id → agent lié (créé si absent) */
    private Agent resolveAgentBySelector(Long selectorId) {
        // 1) agent.id (compat)
        return agentRepository.findById(selectorId).orElseGet(() -> {
            // 2) user_account.id
            UserAccount ua = userAccountRepository.findById(selectorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agent introuvable"));

            // ⛔ rôle incompatible
            if (ua.getRole() != com.gestion.reclamation.backend.model.Role.AGENT) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Rôle incompatible: AGENT attendu");
            }

            // 3) crée/retourne l'Agent à partir de l'email (schéma actuel)
            return agentRepository.findByEmail(ua.getEmail()).orElseGet(() -> {
                Agent a = new Agent();
                a.setEmail(ua.getEmail());
                a.setNom(ua.getNom());
                a.setRole("ROLE_AGENT");
                return agentRepository.save(a);
            });
        });
    }

    @Transactional
    public Reponse add(Long reclamationId, Long agentSelectorId, String message) {
        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message requis");
        }

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réclamation introuvable"));

        Agent agent = null;
        if (agentSelectorId != null) {
            agent = resolveAgentBySelector(agentSelectorId);
        }

        Reponse reponse = new Reponse();
        reponse.setReclamation(reclamation);
        reponse.setAgent(agent);
        reponse.setMessage(message.trim());
        reponse.setDateReponse(LocalDateTime.now());

        try {
            return reponseRepository.save(reponse);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Données invalides");
        }
    }

    @Transactional(readOnly = true)
    public List<Reponse> listByReclamation(Long reclamationId) {
        return reponseRepository.findByReclamationId(reclamationId);
    }
}
