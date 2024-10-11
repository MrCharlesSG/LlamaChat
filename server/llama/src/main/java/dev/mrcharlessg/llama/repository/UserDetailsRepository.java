package dev.mrcharlessg.llama.repository;

import dev.mrcharlessg.llama.domain.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsRepository extends JpaRepository<UserDetails, String> {
    Optional<UserDetails> findByEmail(String email);
}
