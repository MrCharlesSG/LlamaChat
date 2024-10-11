package dev.mrcharlessg.llama.aifunctions.exchange;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;

public class ExchangeHistoricalService extends ExchangeService implements Function<ExchangeHistoricalService.Request, ExchangeHistoricalService.Response> {

    private static final Logger log = LoggerFactory.getLogger(ExchangeService.class);
    private static final String DATE_PATTERN = "\\d{4}-\\d{2}-\\d{2}";

    public ExchangeHistoricalService(ExchangeConfigProperties props) {
        super(props);
    }

    @Override
    public ExchangeHistoricalService.Response apply(ExchangeHistoricalService.Request exchangeRequest) {
        log.info("Received Exchange Historical Request: {}", exchangeRequest);

        // Validate the request
        if(!validateRequest(exchangeRequest)){
            return null;
        }

        String uri = String.format("%s/%s?base=%s&symbols=%s",
                exchangeProps.apiUrl(),
                exchangeRequest.date(),
                exchangeRequest.baseCurrency(),
                exchangeRequest.targetCurrencies());

        log.debug("Formatted Exchange API URI: {}", uri);

        try {
            ExchangeHistoricalService.Response response = restTemplate.getForObject(uri, ExchangeHistoricalService.Response.class);
            log.info("Exchange API Response: {}", response);
            return response;
        } catch (HttpStatusCodeException ex) {
            log.error("Error calling exchange API: Status code = {}, Response = {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new IllegalStateException("Error occurred while fetching exchange rates: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("General error in fetching exchange rates", ex);
            throw new IllegalStateException("An unexpected error occurred", ex);
        }
    }

    /**
     * Validates the input request.
     * Ensures the date is in the correct format, and the base/target currencies are not null or empty.
     */
    private boolean validateRequest(ExchangeHistoricalService.Request request) {
        if (request == null) {
            return false;
        }
        if (!Pattern.matches(DATE_PATTERN, request.date())) {
            return false;
        }
        if (request.baseCurrency() == null || request.baseCurrency().isEmpty()) {
            return false;
        }
        request.targetCurrencies();
        return !request.targetCurrencies().isEmpty();
    }

    public record Request(
            String date,
            String baseCurrency,
            String targetCurrencies
    ) {
        public String targetCurrencies() {
            String cleanValue = targetCurrencies.replaceAll("[\\[\\]\"]", "");
            log.debug("Cleaned target currencies: {}", cleanValue);
            return cleanValue;
        }
    }

    public record Response(String base, String date, Map<String, Double> rates) {
    }
}
