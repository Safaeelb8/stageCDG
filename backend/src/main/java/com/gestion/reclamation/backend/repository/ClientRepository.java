package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {}
