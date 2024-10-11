package dev.mrcharlessg.llama.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class SignUpEmailDTO {

    private String email;
    private String name;
    private String password;
}

