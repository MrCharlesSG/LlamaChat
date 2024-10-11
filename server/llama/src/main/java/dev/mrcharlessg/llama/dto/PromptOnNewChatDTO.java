package dev.mrcharlessg.llama.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PromptOnNewChatDTO {
    public PromptDTO prompt;
    public String chatTitle;
}
