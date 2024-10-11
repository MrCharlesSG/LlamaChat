package dev.mrcharlessg.llama.security.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.mrcharlessg.llama.domain.UserDetails;
import dev.mrcharlessg.llama.repository.UserDetailsRepository;
import dev.mrcharlessg.llama.security.domain.UserInfo;
import dev.mrcharlessg.llama.security.dto.JwtResponseDTO;
import dev.mrcharlessg.llama.security.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import dev.mrcharlessg.llama.security.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@AllArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private RefreshTokenService refreshTokenService;
    private UserDetailsRepository userDetailsRepository;
    private UserRepository userRepository;
    /*@Lazy
    private HttpCookieOAuth2AuthorizationRequestRepository cookieOAuth2AuthorizationRequestRepository;


     */

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // Assuming CustomOAuth2User contains the authenticated user
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("login");
        Optional<UserInfo> byUsername = userRepository.findByUsername(email);
        UserInfo user = byUsername.orElseGet(() ->
                saveUser(oauthUser)

        );


        JwtResponseDTO tokens = refreshTokenService.createRefreshTokenAndToken(user.getUsername());


        //IF stored teh redirection uri in cookies or wherever, retrieve here
        // Si no hay redirect URI, redirigir a la página por defecto
        String targetUrl ="http://localhost:3000/oauth/callback/github"; //redirectUri.orElse("/default-url-after-login");

        // Construir la URL de redirección incluyendo los tokens
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("accessToken", tokens.getAccessToken())
                .queryParam("refreshToken", tokens.getToken())
                .build().toUriString();


        // Redirigir al frontend con los tokens
        getRedirectStrategy().sendRedirect(request, response, targetUrl);


    }

    private UserInfo saveUser(OAuth2User oauthUser){
        String providerId = oauthUser.getAttribute("id").toString();
        String email = oauthUser.getAttribute("login");
        //String name = oauthUser.getName();
        UserInfo user = UserInfo.builder()
                .username(email)
                .provider("github")
                .providerId(providerId)
                .build();
        UserInfo save = userRepository.save(user);

        UserDetails userDetails = UserDetails.builder()
                .email(save.getUsername())
                .name(save.getUsername() + "(From " + save.getProvider() + ")")
                .build();
        userDetailsRepository.save(userDetails);
        return save;
    }
}

