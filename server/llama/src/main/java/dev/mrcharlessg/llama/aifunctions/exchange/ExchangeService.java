package dev.mrcharlessg.llama.aifunctions.exchange;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import java.util.function.Function;

/*
EXCHANGE API
https://api.frankfurter.app
*/
public abstract class ExchangeService {
    private static final Logger log = LoggerFactory.getLogger(ExchangeService.class);
    protected final RestTemplate restTemplate;
    protected final ExchangeConfigProperties exchangeProps;

    public ExchangeService(ExchangeConfigProperties props) {
        this.exchangeProps = props;
        log.info("Exchange API URL: {}", exchangeProps.apiUrl());
        this.restTemplate = new RestTemplate(); // Initialize RestTemplate for REST calls
    }


}
