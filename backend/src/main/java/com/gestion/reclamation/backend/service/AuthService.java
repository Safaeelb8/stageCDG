// src/main/java/com/gestion/reclamation/backend/service/AuthService.java
package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.dto.AuthResponse;
import com.gestion.reclamation.backend.dto.LoginRequest;
import com.gestion.reclamation.backend.dto.RegisterRequest;
import com.gestion.reclamation.backend.model.*;
import com.gestion.reclamation.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class AuthService {

  private final UserAccountRepository repo;
  private final PasswordEncoder encoder;

  // 👇 ajout
  private final ClientRepository clientRepo;
  private final AgentRepository agentRepo;

  public AuthService(UserAccountRepository repo,
                     PasswordEncoder encoder,
                     ClientRepository clientRepo,
                     AgentRepository agentRepo) {
    this.repo = repo;
    this.encoder = encoder;
    this.clientRepo = clientRepo;
    this.agentRepo = agentRepo;
  }

  public AuthResponse register(RegisterRequest req, Role role) {
    if (repo.existsByEmail(req.email()))
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");

    UserAccount u = new UserAccount();
    u.setEmail(req.email());
    u.setPasswordHash(encoder.encode(req.password()));
    u.setNom(req.nom());
    u.setPrenom(req.prenom());
    u.setRole(role);
    repo.save(u);

    // 🔗 créer le profil lié AU MOMENT de l'inscription (cohérence forte)
    if (role == Role.CLIENT) {
      // évite toute duplication
      clientRepo.findByAccount_Id(u.getId()).orElseGet(() -> {
        Client c = new Client();
        c.setEmail(u.getEmail());
        c.setNom(u.getNom());
        c.setAccount(u);          // <— lien fort
        return clientRepo.save(c);
      });
    } else if (role == Role.AGENT) {
      agentRepo.findByAccount_Id(u.getId()).orElseGet(() -> {
        Agent a = new Agent();
        a.setEmail(u.getEmail());
        a.setNom(u.getNom());
        a.setAccount(u);          // <— lien fort
        a.setRole("ROLE_AGENT");
        return agentRepo.save(a);
      });
    }

    return new AuthResponse(
      UUID.randomUUID().toString(),
      u.getId(),
      u.getRole().name(),
      u.getNom()
    );
  }

  public AuthResponse login(LoginRequest req) {
    UserAccount u = repo.findByEmail(req.email())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

    if (!encoder.matches(req.password(), u.getPasswordHash()))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");

    return new AuthResponse(
      UUID.randomUUID().toString(),
      u.getId(),
      u.getRole().name(),
      u.getNom()
    );
  }
}
