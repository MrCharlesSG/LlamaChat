package dev.mrcharlessg.llama;

import dev.mrcharlessg.llama.aifunctions.exchange.ExchangeConfigProperties;
import dev.mrcharlessg.llama.aifunctions.weather.WeatherConfigProperties;
import dev.mrcharlessg.llama.security.configuration.GithubConfigProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({WeatherConfigProperties.class, ExchangeConfigProperties.class, GithubConfigProperties.class})
@SpringBootApplication
public class LlamaApplication {

	public static void main(String[] args) {
		SpringApplication.run(LlamaApplication.class, args);
	}

}
