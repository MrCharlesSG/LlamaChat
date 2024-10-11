package dev.mrcharlessg.llama.dto;

import dev.mrcharlessg.llama.domain.Chat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatDTO {
    private long id;

    private String title;

    private LocalDate date;

    public ChatDTO (Chat chat){
        this.id= chat.getId();
        this.date=chat.getDate();
        this.title= chat.getTitle();
    }
}
