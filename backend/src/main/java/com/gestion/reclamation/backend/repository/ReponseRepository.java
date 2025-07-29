package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByReclamationId(Long reclamationId);
}
