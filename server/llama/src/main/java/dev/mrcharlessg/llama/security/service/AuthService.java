package dev.mrcharlessg.llama.security.service;


import dev.mrcharlessg.llama.domain.UserDetails;
import dev.mrcharlessg.llama.exceptions.ConflictValidationException;
import dev.mrcharlessg.llama.exceptions.ValidationException;
import dev.mrcharlessg.llama.repository.UserDetailsRepository;
import dev.mrcharlessg.llama.security.domain.UserInfo;
import dev.mrcharlessg.llama.security.dto.AuthEmailRequestDTO;
import dev.mrcharlessg.llama.security.dto.JwtResponseDTO;
import dev.mrcharlessg.llama.security.dto.SignUpEmailDTO;
import dev.mrcharlessg.llama.security.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthService {

    private AuthenticationManager authenticationManager;

    private UserRepository userRepository;
    private RefreshTokenService refreshTokenService;
    private UserDetailsRepository userDetailsRepository;
    private PasswordEncoder passwordEncoder;

    public JwtResponseDTO login(AuthEmailRequestDTO authEmailRequestDTO) {
        try {
            Authentication authenticationUsername = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authEmailRequestDTO.getUsername(), authEmailRequestDTO.getPassword()));
            if (authenticationUsername.isAuthenticated()) {
                return refreshTokenService.createRefreshTokenAndToken(authEmailRequestDTO.getUsername());
            } else {
                throw new UsernameNotFoundException("invalid user request..!!");
            }
        } catch (AuthenticationException e) {
            throw new UsernameNotFoundException("invalid user request..!!");
        }

    }

    public JwtResponseDTO registerAndGetToken(SignUpEmailDTO signUpEmailDTO) throws ValidationException {
        Optional<UserInfo> userInfoByUsername = userRepository.findByUsername(signUpEmailDTO.getEmail());
        if (userInfoByUsername.isPresent()) {
            throw new ConflictValidationException("There is already a user with this email");
        }

        Optional<UserDetails> userDetailsByEmail = userDetailsRepository.findByEmail(signUpEmailDTO.getEmail());
        if (userDetailsByEmail.isPresent()) {
            throw new ConflictValidationException("There are already details of this user");
        }
        userRepository.save(
                UserInfo.builder()
                        .username(signUpEmailDTO.getEmail())
                        .password(passwordEncoder.encode(signUpEmailDTO.getPassword()))
                        .build()
        );
        userDetailsRepository.save(new UserDetails(signUpEmailDTO));
        return refreshTokenService.createRefreshTokenAndToken(signUpEmailDTO.getEmail());
    }

    public UserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String name = authentication.getName();
            Optional<UserDetails> userInfo = userDetailsRepository.findByEmail(name);
            return userInfo.orElse(null);
        }
        throw new UsernameNotFoundException("There is no user authenticated");
    }

    public void logout(HttpServletRequest request) throws IllegalArgumentException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("No token provided");
        }

        String token = authHeader.substring(7);
        refreshTokenService.deleteRefreshTokenByUsernameAndBlackListAccessToken(token);
    }

}
