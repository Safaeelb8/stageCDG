package com.gestion.reclamation.backend.controller;

import com.gestion.reclamation.backend.model.Agent;
import com.gestion.reclamation.backend.service.AgentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:4200")
public class AgentController {

    private final AgentService service;

    public AgentController(AgentService service) { this.service = service; }

    @GetMapping
    public List<Agent> all() { return service.getAll(); }

    @PostMapping
    public Agent create(@RequestBody Agent agent) { return service.create(agent); }
}
