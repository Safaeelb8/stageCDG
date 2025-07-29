package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByClientId(Long clientId);
}
