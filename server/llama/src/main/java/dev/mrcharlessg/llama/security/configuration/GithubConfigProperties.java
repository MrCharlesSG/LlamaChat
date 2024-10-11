package dev.mrcharlessg.llama.security.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(value = "spring.security.oauth2.client.registration.github")
public record GithubConfigProperties(
        String clientID,
        String clientSecret,
        String authorizationUri,
        String tokenUri,
        String userInfoUri
) {
}
