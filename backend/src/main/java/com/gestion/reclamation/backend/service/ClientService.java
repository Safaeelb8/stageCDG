// backend/src/main/java/com/gestion/reclamation/backend/service/ClientService.java
package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    public Client getById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
    }

    // ✅ Méthode attendue par le controller (Optional)
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    public Client create(Client client) {
        return clientRepository.save(client);
    }
}
