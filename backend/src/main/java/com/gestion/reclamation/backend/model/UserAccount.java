package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_account")
public class UserAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")                // pas obligatoire, mais explicite
  private Long id;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  private String nom;
  private String prenom;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;

  // --- Getters & Setters ---
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

  public String getNom() { return nom; }
  public void setNom(String nom) { this.nom = nom; }

  public String getPrenom() { return prenom; }
  public void setPrenom(String prenom) { this.prenom = prenom; }

  public Role getRole() { return role; }
  public void setRole(Role role) { this.role = role; }
}
