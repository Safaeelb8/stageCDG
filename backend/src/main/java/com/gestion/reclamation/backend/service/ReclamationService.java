package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.model.StatutReclamation;
import com.gestion.reclamation.backend.repository.ClientRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Optional<Reclamation> getReclamationById(Long id) {
        return reclamationRepository.findById(id);
    }

    public Reclamation createReclamation(Long clientId, Reclamation reclamation) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        
        reclamation.setClient(client);
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setStatut(StatutReclamation.NOUVELLE.toString());
        
        return reclamationRepository.save(reclamation);
    }

    public Reclamation updateStatus(Long id, StatutReclamation newStatus) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée"));
        
        reclamation.setStatut(newStatus.toString());
        return reclamationRepository.save(reclamation);
    }
    
    public List<Reclamation> getReclamationsByClient(Long clientId) {
        return reclamationRepository.findByClientId(clientId);
    }

}
