package dev.mrcharlessg.llama.dto;

import dev.mrcharlessg.llama.domain.Chat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatAndMessagesDTO {

    private ChatDTO chatInfo;
    private List<MessageDTO> messages;

    public ChatAndMessagesDTO(Chat chat){
        chatInfo = new ChatDTO(chat);
        messages = chat
                .getMessages()
                .stream()
                .map(MessageDTO::new)
                .toList();
    }
}
