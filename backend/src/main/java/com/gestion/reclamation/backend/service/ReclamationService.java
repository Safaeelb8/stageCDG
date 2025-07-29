package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.model.Reclamation;
import com.gestion.reclamation.backend.repository.ClientRepository;
import com.gestion.reclamation.backend.repository.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private ClientRepository clientRepository;

    public Reclamation createReclamation(Long clientId, Reclamation reclamation) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        reclamation.setClient(client);
        reclamation.setDateCreation(LocalDateTime.now());
        reclamation.setStatut("NOUVELLE");
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> getReclamationsByClient(Long clientId) {
        return reclamationRepository.findByClientId(clientId);
    }
}
