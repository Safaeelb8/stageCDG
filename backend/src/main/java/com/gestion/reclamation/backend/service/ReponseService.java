package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.repository.AgentRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import com.gestion.reclamation.backend.repository.ReponseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReponseService {

    private final ReponseRepository reponseRepository;
    private final ReclamationRepository reclamationRepository;
    private final AgentRepository agentRepository;

    public ReponseService(ReponseRepository reponseRepository,
                          ReclamationRepository reclamationRepository,
                          AgentRepository agentRepository) {
        this.reponseRepository = reponseRepository;
        this.reclamationRepository = reclamationRepository;
        this.agentRepository = agentRepository;
    }

    public Reponse add(Long reclamationId, Long agentId, String message) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent introuvable"));

        Reponse reponse = new Reponse();
        reponse.setReclamation(reclamation);
        reponse.setAgent(agent);
        reponse.setMessage(message);
        reponse.setDateReponse(LocalDateTime.now());

        return reponseRepository.save(reponse);
    }

    public List<Reponse> listByReclamation(Long reclamationId) {
        return reponseRepository.findByReclamationId(reclamationId);
    }
}
