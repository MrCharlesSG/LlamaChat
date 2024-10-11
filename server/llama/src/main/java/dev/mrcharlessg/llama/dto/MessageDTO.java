package dev.mrcharlessg.llama.dto;

import dev.mrcharlessg.llama.domain.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private String response;
    private String message;

    public MessageDTO(Message message){
        this.response = message.getResponse();
        this.message = message.getPrompt();
    }

    @Override
    public String toString() {
        return String.format("""
                            `history_entry`:
                                `prompt`: %s
                            
                                `response`: %s
                            -----------------
                           \n
                """, message, response);
    }
}
