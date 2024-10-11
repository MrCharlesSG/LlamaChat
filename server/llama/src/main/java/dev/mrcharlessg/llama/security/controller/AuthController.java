package dev.mrcharlessg.llama.security.controller;

import dev.mrcharlessg.llama.exceptions.ConflictValidationException;
import dev.mrcharlessg.llama.security.dto.*;
import dev.mrcharlessg.llama.security.service.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("auth")
@AllArgsConstructor
public class AuthController {

    private RefreshTokenService refreshTokenService;
    private AuthService authService;
    private InMemoryTokenBlacklist tokenBlacklist;
    private JwtService jwtService;
    private OAuth2GithubService oAuth2GithubService;

    @PostMapping("/api/v1/login/email")
    public JwtResponseDTO authenticateAndGetToken(@RequestBody AuthEmailRequestDTO authEmailRequestDTO){
        try {
            return authService.login(authEmailRequestDTO);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/api/v1/login/oauth/github")
    public JwtResponseDTO authenticateGithubAndGetToken(@RequestParam String code){
        try {
            return oAuth2GithubService.login(code);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/api/v1/register/email")
    public JwtResponseDTO registerAndGetToken(@RequestBody SignUpEmailDTO signUpEmailDTO){
        try {
            return authService.registerAndGetToken(signUpEmailDTO);
        }catch (ConflictValidationException e){
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
        catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }



    @PostMapping("/api/v1/refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO){
        try {
            return  refreshTokenService.refreshToken(refreshTokenRequestDTO);
        } catch (IllegalAccessException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/api/v1/user-info")
    public UserDetailsDTO getUserDetails(){
        return new UserDetailsDTO(authService.getCurrentUser());
    }

    @PostMapping("/api/v1/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try{
            authService.logout(request);
            return ResponseEntity.ok("Logged out successfully");
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Logout failed: " + e.getMessage());
        }
    }







}
