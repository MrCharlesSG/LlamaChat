package dev.mrcharlessg.llama.repository;

import dev.mrcharlessg.llama.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessagesRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatId(Long chatId);

    void deleteByChatId(Long chatId);
}

