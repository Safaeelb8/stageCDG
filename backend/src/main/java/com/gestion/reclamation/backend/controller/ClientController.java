package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Client;
import com.gestion.reclamation.backend.service.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service) { this.service = service; }

    @GetMapping
    public List<Client> all() { return service.getAll(); }

    @PostMapping
    public Client create(@RequestBody Client client) { return service.create(client); }
}
