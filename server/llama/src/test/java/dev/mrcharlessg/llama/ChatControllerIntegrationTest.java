package dev.mrcharlessg.llama;


import com.fasterxml.jackson.databind.ObjectMapper;
import dev.mrcharlessg.llama.dto.ChatDTO;
import dev.mrcharlessg.llama.dto.NewChatDTO;
import dev.mrcharlessg.llama.dto.PromptDTO;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static dev.mrcharlessg.llama.Utils.getStringOfJsonFile;
import static dev.mrcharlessg.llama.Utils.loginOkWithEmail;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-integrationtest.properties"
)
@Transactional
public class ChatControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    private String accessToken;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() throws Exception {
        JSONObject login = loginOkWithEmail(
                mvc,
                getStringOfJsonFile("/json/auth/login.json")
        );
        accessToken = login.getString("accessToken");
    }

    @Test
    public void testGetAllChatsInfo() throws Exception {
        // Perform GET request to retrieve all chats for the user
        mvc.perform(get("/chat")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testGetChatById() throws Exception {
        // Assuming chat with id 1 exists for vic.mar@example.com
        mvc.perform(get("/chat/1")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testGetChatById_NotFound() throws Exception {
        // Test with an invalid chat ID (assuming chat ID 9999 doesn't exist)
        mvc.perform(get("/chat/9999")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    public void testCreateNewChat() throws Exception {
        // Create a new chat with a specific title
        String title = "Nuevo Chat de Prueba";

        mvc.perform(post("/chat/new-chat/" + title)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testPromptMessageInChat() throws Exception {
        // Assuming chat with id 1 exists, and we want to send a message to it
        JSONObject promptRequest = new JSONObject();
        promptRequest.put("message", "¿Qué tal estás?");

        mvc.perform(post("/chat/1")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(promptRequest.toString()))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testDeleteChat() throws Exception {
        // Assuming chat with id 1 exists
        mvc.perform(delete("/chat/1")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testCreatePromptAndDeleteChat() throws Exception {
        // Paso 1: Crear un chat
        NewChatDTO newChat = new NewChatDTO();
        newChat.setTitle("Test Chat");

        ResultActions createChatResult = mvc.perform(post("/chat/new-chat")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newChat)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Chat")));

        // Extraer el ID del chat creado
        String chatResponse = createChatResult.andReturn().getResponse().getContentAsString();
        ChatDTO createdChat = objectMapper.readValue(chatResponse, ChatDTO.class);
        long chatId = createdChat.getId();

        // Paso 2: Obtener todos los chats y comprobar que el chat creado está presente
        mvc.perform(get("/chat").header("Authorization", "Bearer " + accessToken))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[?(@.id == " + chatId + ")]").exists());

        // Paso 3: Enviar un mensaje al chat creado (prompt)
        PromptDTO prompt = new PromptDTO();
        prompt.setMessage("Hello, world!");

        mvc.perform(post("/chat/" + chatId)
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(prompt)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Hello, world!")));

        // Paso 4: Recoger los mensajes del chat y comprobar que el mensaje enviado está presente
        mvc.perform(get("/chat/" + chatId).header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.chatInfo.id", is((int) chatId)));

        // Paso 5: Eliminar el chat
        mvc.perform(delete("/chat/" + chatId).header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk());

        // Paso 6: Verificar que el chat ha sido eliminado
        mvc.perform(get("/chat").header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + chatId + ")]").doesNotExist());
    }
}

