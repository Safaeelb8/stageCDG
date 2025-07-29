package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Agent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;

    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    private List<Reponse> reponses;

    // Getters et Setters
}
