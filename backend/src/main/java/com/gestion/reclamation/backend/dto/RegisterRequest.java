// src/main/java/com/gestion/reclamation/backend/dto/RegisterRequest.java
package com.gestion.reclamation.backend.dto;
public record RegisterRequest(String email, String password, String nom, String prenom) {}
