package dev.mrcharlessg.llama;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.mrcharlessg.llama.security.dto.AuthEmailRequestDTO;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class Utils {
    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static JSONObject loginOkWithUser(MockMvc mvc, AuthEmailRequestDTO authEmailRequestDTO) throws Exception {
        return loginOkWithEmail(mvc, asJsonString(authEmailRequestDTO));
    }

    public static JSONObject loginOkWithEmail(MockMvc mvc, String request) throws Exception {
        MvcResult result = mvc.perform(post("/auth/api/v1/login/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        return new JSONObject(content);
    }

    public static JSONObject loginKO(MockMvc mvc, String request) throws Exception {
        MvcResult result = mvc.perform(post("/auth/api/v1/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest())
                .andReturn();
        return new JSONObject();
    }

    public static AuthEmailRequestDTO correctUser(){
        return AuthEmailRequestDTO
                .builder()
                .password("user")
                .username("vic.mar@example.com")
                .build();
    }
    public static AuthEmailRequestDTO correctUserSecond(){
        return AuthEmailRequestDTO
                .builder()
                .password("user")
                .username("ger.pa@example.com")
                .build();
    }

    public static String getStringOfJsonPartFromFile(String part, String filePath) throws IOException, JSONException {
        InputStream inputStream = Utils.class.getResourceAsStream(filePath);
        if (inputStream != null) {
            try (java.util.Scanner scanner = new java.util.Scanner(inputStream, StandardCharsets.UTF_8.name())) {
                scanner.useDelimiter("\\A");
                String json = scanner.hasNext() ? scanner.next() : "";

                JSONObject jsonObject = new JSONObject(json);
                return jsonObject.getJSONObject(part).toString();
            }
        }
        throw new IOException("File not found: " + filePath);
    }

    public static String getStringOfJsonFile(String filePath) throws IOException {
        InputStream inputStream = Utils.class.getResourceAsStream(filePath);
        if (inputStream != null) {
            try (java.util.Scanner scanner = new java.util.Scanner(inputStream, StandardCharsets.UTF_8.name())) {
                scanner.useDelimiter("\\A");
                return scanner.hasNext() ? scanner.next() : "";
            }
        }
        throw new IOException("File not found: " + filePath);
    }

}
