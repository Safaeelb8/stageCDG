// src/main/java/com/gestion/reclamation/backend/repository/AgentRepository.java
package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByEmail(String email); // ⬅️ AJOUT
    Optional<Agent> findByAccount_Id(Long userAccountId);    // 👈 NOUVEAU

}
