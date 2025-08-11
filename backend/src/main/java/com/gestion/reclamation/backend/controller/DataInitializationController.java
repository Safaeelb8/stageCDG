package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.repository.AgentRepository;
import com.gestion.reclamation.backend.repository.ClientRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:4200", "http://localhost:49217"})
public class DataInitializationController {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ReclamationRepository reclamationRepository;

    @PostMapping("/data")
    public ResponseEntity<String> initializeData() {
        try {
            // Créer des agents de test
            Agent agent1 = new Agent();
            agent1.setNom("safae");
            agent1.setEmail("safae@cdg.ma");
            agentRepository.save(agent1);

            Agent agent2 = new Agent();
            agent2.setNom("hiba");
            agent2.setEmail("hiba@cdg.ma");
            agentRepository.save(agent2);

            // Créer des clients de test
            Client client1 = new Client();
            client1.setNom("Ahmed ");
            client1.setEmail("ahmed@email.com");
            clientRepository.save(client1);

            

            // Créer des réclamations de test
            Reclamation reclamation1 = new Reclamation();
            reclamation1.setCategorie("Retard de service");
            reclamation1.setObjet("Retard dans le traitement de ma demande");
            reclamation1.setDescription("J'ai soumis une demande il y a plus de 2 semaines et je n'ai toujours pas reçu de réponse. C'est très frustrant car j'ai besoin de cette information rapidement.");
            reclamation1.setDateCreation(LocalDateTime.now().minusDays(5));
            reclamation1.setStatut("En cours");
            reclamation1.setClient(client1);
            reclamationRepository.save(reclamation1);

            Reclamation reclamation2 = new Reclamation();
            reclamation2.setCategorie("Erreur de données");
            reclamation2.setObjet("Informations incorrectes dans mon dossier");
            reclamation2.setDescription("J'ai remarqué que certaines informations dans mon dossier personnel sont incorrectes. Pouvez-vous vérifier et corriger ces erreurs ?");
            reclamation2.setDateCreation(LocalDateTime.now().minusDays(3));
            reclamation2.setStatut("En attente");
            reclamation2.setClient(client1);
            reclamationRepository.save(reclamation2);

            return ResponseEntity.ok("Données de test initialisées avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'initialisation : " + e.getMessage());
        }
    }
} 