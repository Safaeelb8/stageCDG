// com.gestion.reclamation.backend.model.Agent
package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity @Table(name = "agent")
public class Agent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    private String role; // ex: ROLE_AGENT, ROLE_ADMIN (optionnel; la vérité est dans UserAccount.role)

    // 👇 LIEN NOUVEAU
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_id", unique = true)
    private UserAccount account;

    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reponse> reponses;

    public Agent() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UserAccount getAccount() { return account; }
    public void setAccount(UserAccount account) { this.account = account; }

    public List<Reponse> getReponses() { return reponses; }
    public void setReponses(List<Reponse> reponses) { this.reponses = reponses; }
}
