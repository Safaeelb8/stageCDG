package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.Reponse;
import com.gestion.reclamation.backend.repository.AgentRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import com.gestion.reclamation.backend.repository.ReponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReponseService {

    @Autowired
    private ReponseRepository reponseRepository;

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;

    public Reponse ajouterReponse(Long reclamationId, Long agentId, String message) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent non trouvé"));

        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée"));

        Reponse reponse = new Reponse();
        reponse.setAgent(agent);
        reponse.setReclamation(reclamation);
        reponse.setMessage(message);
        reponse.setDateReponse(LocalDateTime.now());

        return reponseRepository.save(reponse);
    }

    public List<Reponse> getReponsesByReclamation(Long reclamationId) {
        return reponseRepository.findByReclamationId(reclamationId);
    }
}
