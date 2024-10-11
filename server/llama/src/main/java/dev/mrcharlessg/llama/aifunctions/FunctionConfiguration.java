package dev.mrcharlessg.llama.aifunctions;


import dev.mrcharlessg.llama.aifunctions.exchange.*;
import dev.mrcharlessg.llama.aifunctions.weather.WeatherConfigProperties;
import dev.mrcharlessg.llama.aifunctions.weather.WeatherService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Configuration
public class FunctionConfiguration {

    private final WeatherConfigProperties propsWeather;
    private final ExchangeConfigProperties propsExchange;

    public FunctionConfiguration(WeatherConfigProperties propsWeather, ExchangeConfigProperties propsExchange) {
        this.propsWeather = propsWeather;
        this.propsExchange = propsExchange;
    }

    @Bean
    @Description("Get the current weather conditions for the given city.")
    public Function<WeatherService.Request,WeatherService.Response> currentWeatherFunction() {
        return new WeatherService(propsWeather);
    }

    @Bean
    @Description("Fetches the exchange rates for a specified date (in YYYY-MM-DD format), base currency, and target currencies. " +
            "The currencies must be abbreviated (e.g., EUR, USD, CHF, CAD, GBP, MXN, etc.).")
    public Function<ExchangeHistoricalService.Request, ExchangeHistoricalService.Response> getExchangeRates() {
        return new ExchangeHistoricalService(propsExchange);
    }

    /*@Bean
    @Description("Get the exchange rates for a specified start date, end date, base currency, target currencies." +
            "The currencies are abreviated (EUR, USD, CHF, CAD, GBP, MXN...) and dates are in in YYYY-MM-DD format")
    public Function<ExchangeTimeSeriesService.Request, ExchangeTimeSeriesService.Response> exchangeTimeSeriesFunction() {
        return new ExchangeTimeSeriesService(propsExchange);
    }

     */

}
