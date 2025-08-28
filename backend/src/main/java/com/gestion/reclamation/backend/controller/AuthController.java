package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.dto.AuthResponse;
import com.gestion.reclamation.backend.dto.LoginRequest;
import com.gestion.reclamation.backend.dto.RegisterRequest;
import com.gestion.reclamation.backend.model.Role;
import com.gestion.reclamation.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")                 // URL racine: /api/auth/...
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

  private final AuthService auth;

  public AuthController(AuthService auth) {
    this.auth = auth;
  }

  // Petit endpoint pour vérifier le mapping
  @GetMapping("/_ping")
  public String ping() { return "auth ok"; }

  // POST /api/auth/register?role=CLIENT|AGENT
  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthResponse register(@RequestParam Role role, @RequestBody RegisterRequest req) {
    return auth.register(req, role);
  }

  // POST /api/auth/login
  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest req) {
    return auth.login(req);
  }
}
