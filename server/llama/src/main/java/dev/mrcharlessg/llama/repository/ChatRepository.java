package dev.mrcharlessg.llama.repository;

import dev.mrcharlessg.llama.domain.Chat;
import dev.mrcharlessg.llama.domain.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUserEmail(String email);
    Optional<Chat> findByIdAndUserEmail(Long id, String email);

    void deleteByIdAndUserEmail(Long id, String email);

}

