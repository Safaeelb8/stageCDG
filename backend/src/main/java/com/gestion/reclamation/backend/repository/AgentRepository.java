package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {}
