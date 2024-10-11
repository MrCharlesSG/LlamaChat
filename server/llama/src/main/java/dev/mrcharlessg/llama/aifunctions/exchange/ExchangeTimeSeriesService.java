package dev.mrcharlessg.llama.aifunctions.exchange;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.function.Function;

public class ExchangeTimeSeriesService extends ExchangeService implements Function<ExchangeTimeSeriesService.Request, ExchangeTimeSeriesService.Response> {
    public ExchangeTimeSeriesService(ExchangeConfigProperties props) {
        super(props);
    }

    private static final Logger log = LoggerFactory.getLogger(ExchangeService.class);

    @Override
    public ExchangeTimeSeriesService.Response apply(ExchangeTimeSeriesService.Request exchangeRequest) {
        log.info("Exchange time-series Request: {}", exchangeRequest);
        if (exchangeRequest == null) {
            throw new IllegalArgumentException("Request can not be null");
        }
        String uri = String.format("%s/%s..%s?base=%s&symbols=%s", exchangeProps.apiUrl(),
                exchangeRequest.startDate(),
                exchangeRequest.endDate(),
                exchangeRequest.baseCurrency(),
                exchangeRequest.targetCurrencies());

        ExchangeTimeSeriesService.Response response = restTemplate.getForObject(uri, ExchangeTimeSeriesService.Response.class);
        log.info("Exchange API Response: {}", response);
        return response;
    }

    public record Request(String startDate,
                          String endDate,
                          String baseCurrency,
                          String targetCurrencies
    ) {
        public String targetCurrencies(){
            String cleanValue = targetCurrencies.replaceAll("[\\[\\]\"]", "");
            log.info("The clean value in TIme series is: {} ", cleanValue);
            return cleanValue;
        }
    }

    public record Response(String base, String date, Map<String, Map<String, Double>> rates) {
    }
}
