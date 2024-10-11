package dev.mrcharlessg.llama.security.service;


import dev.mrcharlessg.llama.security.domain.RefreshToken;
import dev.mrcharlessg.llama.security.domain.UserInfo;
import dev.mrcharlessg.llama.security.dto.JwtResponseDTO;
import dev.mrcharlessg.llama.security.dto.RefreshTokenRequestDTO;
import dev.mrcharlessg.llama.security.repository.RefreshTokenRepository;
import dev.mrcharlessg.llama.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static dev.mrcharlessg.llama.security.configuration.TokenConfig.EXPIRATION_TIME_TOKEN;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private InMemoryTokenBlacklist tokenBlacklist;


    private RefreshToken createRefreshToken(String username) {
        Optional<UserInfo> userInfo = userRepository.findByUsername(username);
        if (userInfo.isEmpty()) throw new IllegalArgumentException("User Does not exists");
        Optional<RefreshToken> byUserInfoId = refreshTokenRepository.findByUserInfoId(userInfo.get().getId());
        int id = 0;
        if(byUserInfoId.isPresent()){
            id= byUserInfoId.get().getId();
        }

        RefreshToken refreshToken = RefreshToken.builder()
                .id(id)
                .userInfo(userInfo.get())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(EXPIRATION_TIME_TOKEN))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public JwtResponseDTO createRefreshTokenAndToken(String username) {
        RefreshToken refreshToken = createRefreshToken(username);
        return JwtResponseDTO.builder()
                .accessToken(jwtService.generateToken(username))
                .token(refreshToken.getToken())
                .build();
    }

    private Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please make a new login..!");
        }
        return token;
    }

    public JwtResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequestDTO) throws IllegalAccessException {
        return findByToken(refreshTokenRequestDTO.getToken())
                .map(this::verifyExpiration)
                .map(RefreshToken::getUserInfo)
                .map(userInfo -> {
                    String accessToken = jwtService.generateToken(userInfo.getUsername());
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequestDTO.getToken())
                            .build();
                }).orElseThrow(() -> new IllegalAccessException("Refresh Token is not in DB..!!"));
    }

    public void deleteRefreshTokenByUsernameAndBlackListAccessToken(String token) throws IllegalArgumentException {
        String username = jwtService.extractUsername(token);
        Optional<UserInfo> userInfo = userRepository.findByUsername(username);
        tokenBlacklist.addToBlacklist(token);
        if (userInfo.isEmpty()) throw new IllegalArgumentException("User does not exist");

        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserInfoId(userInfo.get().getId());
        if (refreshToken.isPresent()) {
            refreshTokenRepository.delete(refreshToken.get());
        } else {
            throw new IllegalArgumentException("Refresh token not found");
        }
    }

}
