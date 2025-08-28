// src/main/java/com/gestion/reclamation/backend/dto/AuthResponse.java
package com.gestion.reclamation.backend.dto;
public record AuthResponse(String token, Long userId, String role, String nom) {}
