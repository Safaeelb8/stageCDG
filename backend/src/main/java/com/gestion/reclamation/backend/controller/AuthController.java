package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.User;
import com.gestion.reclamation.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200"})
public class AuthController {
    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(authService.register(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String identifier = payload.get("identifier"); // <-- important
            String password   = payload.get("password");
            User user = authService.login(identifier, password);

            // structure “simple” de réponse pour ton front actuel
            return ResponseEntity.ok(Map.of(
                    "token", "dummy", // (si tu n’as pas encore de JWT)
                    "user",  user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
