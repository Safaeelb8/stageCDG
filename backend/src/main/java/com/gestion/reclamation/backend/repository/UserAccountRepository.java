// src/main/java/com/gestion/reclamation/backend/repository/UserAccountRepository.java
package com.gestion.reclamation.backend.repository;

import com.gestion.reclamation.backend.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
  Optional<UserAccount> findByEmail(String email);
  boolean existsByEmail(String email);
}
