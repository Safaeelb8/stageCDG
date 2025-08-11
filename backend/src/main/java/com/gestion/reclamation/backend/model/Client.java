package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Reclamation> reclamations;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Reclamation> getReclamations() { return reclamations; }
    public void setReclamations(List<Reclamation> reclamations) { this.reclamations = reclamations; }
}
