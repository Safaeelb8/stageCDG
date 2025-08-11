package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByClientId(Long clientId);
    
    @Query("SELECT r FROM Reclamation r LEFT JOIN FETCH r.client LEFT JOIN FETCH r.reponses")
    List<Reclamation> findAllWithClientAndReponses();
}
