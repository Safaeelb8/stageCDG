// src/main/java/com/gestion/reclamation/backend/repository/ClientRepository.java
package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByAccount_Id(Long userAccountId); // ⬅️ AJOUT
}
