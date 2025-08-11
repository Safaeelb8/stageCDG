package com.gestion.reclamation.backend.service;

import com.gestion.reclamation.backend.model.User;
import com.gestion.reclamation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername()))
            throw new RuntimeException("Username already exists");
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        return userRepository.save(user);
    }

    /** identifier = username OU email */
    public User login(String identifier, String rawPassword) {
        User user = userRepository
            .findByUsernameOrEmail(identifier, identifier)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword()))
            throw new RuntimeException("Invalid password");
        if (!user.isActive())
            throw new RuntimeException("User account is disabled");

        return user;
    }
}
