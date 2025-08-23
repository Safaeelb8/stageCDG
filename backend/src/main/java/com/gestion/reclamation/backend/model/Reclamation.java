// backend/src/main/java/com/gestion/reclamation/backend/model/Reclamation.java
package com.gestion.reclamation.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String objet;

    @Column(length = 1000)
    private String description;

    private String categorie;

    @Enumerated(EnumType.STRING)
    private StatutReclamation statut;

    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({"reclamations"})
    private Client client;

    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Reponse> reponses;

    // ====== Fichier joint (stocké en base) ======
    private String fileName;
    private String fileType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @JsonIgnore
    @Column(name = "file_data", columnDefinition = "LONGBLOB") // <-- ajoute ceci
    private byte[] fileData;

    // ====== Getters/Setters ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getObjet() { return objet; }
    public void setObjet(String objet) { this.objet = objet; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public StatutReclamation getStatut() { return statut; }
    public void setStatut(StatutReclamation statut) { this.statut = statut; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public List<Reponse> getReponses() { return reponses; }
    public void setReponses(List<Reponse> reponses) { this.reponses = reponses; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }
}
