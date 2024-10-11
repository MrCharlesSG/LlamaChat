package dev.mrcharlessg.llama.security.repository;


import dev.mrcharlessg.llama.security.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUserInfoId(Long userId);
    Optional<RefreshToken> findByUserInfoIdAndExpiryDateAfter(Long userId, Instant currentInstant);
}
