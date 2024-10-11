package dev.mrcharlessg.llama.security.aspect;


import dev.mrcharlessg.llama.exceptions.ValidationException;
import dev.mrcharlessg.llama.security.dto.SignUpEmailDTO;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.regex.Pattern;

@Aspect
@Component
public class SignUpValidationAspect {

    // Validar antes de registrar un nuevo usuario y obtener el token
    @Before("execution(* dev.mrcharlessg.llama.security.service.AuthService.registerAndGetToken(..)) && args(signUpEmailDTO)")
    public void validateSignUpBeforeRegister(JoinPoint joinPoint, SignUpEmailDTO signUpEmailDTO) throws ValidationException {
        validateSignUp(signUpEmailDTO);
    }

    private void validateSignUp(SignUpEmailDTO signUpEmailDTO) throws ValidationException {
        validateEmail(signUpEmailDTO.getEmail());
        validateName(signUpEmailDTO.getName());
        validatePassword(signUpEmailDTO.getPassword());
    }

    private void validateEmail(String email) throws ValidationException {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidationException("Email cannot be null or empty.");
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        if (!pattern.matcher(email).matches()) {
            throw new ValidationException("Invalid email format.");
        }
    }

    private void validateName(String name) throws ValidationException {
        if (name == null || name.trim().isEmpty()) {
            throw new ValidationException("Name cannot be null or empty.");
        }
    }



    private void validatePassword(String password) throws ValidationException {
        if (password == null || password.trim().isEmpty()) {
            throw new ValidationException("Password cannot be null or empty.");
        }
        /*
        if (password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters long.");
        }
        // add more password validation rules (e.g., contains special characters, numbers, etc.)
         */
    }
}

