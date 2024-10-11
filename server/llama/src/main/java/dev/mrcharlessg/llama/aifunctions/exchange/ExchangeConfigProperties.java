package dev.mrcharlessg.llama.aifunctions.exchange;


import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(value = "exchange")
public record ExchangeConfigProperties(String apiUrl) {
}
