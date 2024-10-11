package dev.mrcharlessg.llama.domain;

import dev.mrcharlessg.llama.security.dto.SignUpEmailDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
@Table(name = "userdetails")
public class UserDetails {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;



    public UserDetails(SignUpEmailDTO signUpEmailDTO){
        this.email=signUpEmailDTO.getEmail();
        this.name= signUpEmailDTO.getName();
    }
}

