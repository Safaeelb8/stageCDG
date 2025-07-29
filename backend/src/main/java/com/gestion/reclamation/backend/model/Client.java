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
}
