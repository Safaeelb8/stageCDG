package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.repository.AgentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentService {

    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public List<Agent> getAll() { return agentRepository.findAll(); }

    public Agent getById(Long id) {
        return agentRepository.findById(id).orElseThrow(() -> new RuntimeException("Agent introuvable"));
    }

    public Agent create(Agent agent) { return agentRepository.save(agent); }
}
