package dev.mrcharlessg.llama.aifunctions.exchange;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;

public class StringArrayDeserializer extends JsonDeserializer<String[]> {

    @Override
    public String[] deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        // Remove the quotes and brackets, then split by comma
        String cleanValue = value.replaceAll("[\\[\\]\"]", "");
        return cleanValue.split(",");
    }
}
