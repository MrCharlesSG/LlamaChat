package dev.mrcharlessg.llama.security.service;

import dev.mrcharlessg.llama.aifunctions.exchange.ExchangeConfigProperties;
import dev.mrcharlessg.llama.aifunctions.exchange.ExchangeService;
import dev.mrcharlessg.llama.repository.UserDetailsRepository;
import dev.mrcharlessg.llama.security.configuration.GithubConfigProperties;
import dev.mrcharlessg.llama.security.dto.JwtResponseDTO;
import dev.mrcharlessg.llama.security.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OAuth2GithubService {


    @Autowired
    private GithubConfigProperties configProperties;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private UserDetailsRepository userDetailsRepository;
    @Autowired
    private UserRepository userRepository;
    protected final RestTemplate restTemplate;
    private static final Logger log = LoggerFactory.getLogger(OAuth2GithubService.class);

    public OAuth2GithubService() {
        this.restTemplate = new RestTemplate(); // Initialize RestTemplate for REST calls
    }

    public JwtResponseDTO login(String code){
        String uri = String.format("%s?client_id=%s&client_secret=%s&code=%s", configProperties.tokenUri(),
                configProperties.clientID(),
                configProperties.clientSecret(),
                code);
        Response response = restTemplate.postForObject(uri,null, Response.class);

        HttpHeaders header = new HttpHeaders();
        header.set("Authorization", "Bearer " + response.accessToken);
        header.setContentType(MediaType.APPLICATION_JSON);

        ParameterizedTypeReference<Object> responseType = new ParameterizedTypeReference<Object>() {};

        ResponseEntity<Object> responseEntity = restTemplate.exchange(
                configProperties.userInfoUri(),
                HttpMethod.GET,
                new HttpEntity<>(header),
                responseType
        );

        log.info("Exchange API Response (After correct gihub exchange: {}", responseEntity.getBody());
        return null;


    }


    private record Response (String accessToken, String scope, String tokenType){

    }
}
