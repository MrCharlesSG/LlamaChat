package dev.mrcharlessg.llama.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(name = "response", length = 1000)
    private String response;

    @Column(name = "prompt", length = 255)
    private String prompt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_message", nullable = false)
    private Chat chat;

    @Override
    public String toString() {
        return String.format("""
                            `history_entry`:
                                `prompt`: %s
                            
                                `response`: %s
                            -----------------
                           \n
                """, prompt, response);
    }
}
