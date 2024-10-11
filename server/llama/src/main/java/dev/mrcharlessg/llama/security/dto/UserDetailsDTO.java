package dev.mrcharlessg.llama.security.dto;

import dev.mrcharlessg.llama.domain.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDTO {

    private String email;
    private String name;

    public UserDetailsDTO(UserDetails userDetails) {
        this.email = userDetails.getEmail();
        this.name = userDetails.getName();
    }
}
