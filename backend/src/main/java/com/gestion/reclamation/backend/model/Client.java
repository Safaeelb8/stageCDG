// com.gestion.reclamation.backend.model.Client
package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Entity @Table(name = "client")
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // (on peut garder ces colonnes pour affichage, mais la source de vérité est UserAccount)
    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    // 👇 LIEN NOUVEAU : chaque client est rattaché à 1 userAccount
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_account_id", unique = true)
    private UserAccount account;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reclamation> reclamations;

    public Client() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserAccount getAccount() { return account; }
    public void setAccount(UserAccount account) { this.account = account; }

    public List<Reclamation> getReclamations() { return reclamations; }
    public void setReclamations(List<Reclamation> reclamations) { this.reclamations = reclamations; }
}
