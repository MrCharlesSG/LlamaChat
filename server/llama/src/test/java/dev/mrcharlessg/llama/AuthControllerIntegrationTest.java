package dev.mrcharlessg.llama;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static dev.mrcharlessg.llama.Utils.getStringOfJsonFile;
import static dev.mrcharlessg.llama.Utils.loginOkWithEmail;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-integrationtest.properties"
)
@Transactional
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void givenValidLogin_whenAuthAndGetToken_thenStatusOK() throws Exception {
        JSONObject login = loginOkWithEmail(
                mvc,
                getStringOfJsonFile("/json/auth/login.json")
        );
        assertNotNull(login.getString("accessToken"));
        assertNotNull(login.getString("token"));
    }

    @Test
    public void givenValidLogin_whenGetUserInfo_thenStatusOK() throws Exception {
        // Login y obtención del token de acceso
        JSONObject login = loginOkWithEmail(
                mvc,
                getStringOfJsonFile("/json/auth/login.json")
        );
        String accessToken = login.getString("accessToken");

        // Ejecutar la solicitud GET para obtener la información del usuario
        mvc.perform(get("/auth/api/v1/user-info")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.email").value("vic.mar@example.com"))
                .andExpect(jsonPath("$.name").value("Vicente"));
    }



    @Test
    public void givenValidRefreshToken_whenRefreshToken_thenStatusOK() throws Exception {
        // Step 1: Login to get initial tokens
        JSONObject login = loginOkWithEmail(
                mvc,
                getStringOfJsonFile("/json/auth/login.json")
        );
        String refreshToken = login.getString("token");

        // Step 2: Prepare the refresh token request payload
        JSONObject refreshTokenRequest = new JSONObject();
        refreshTokenRequest.put("token", refreshToken);

        // Step 3: Perform the POST request to refresh token endpoint
        mvc.perform(post("/auth/api/v1/refreshToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshTokenRequest.toString()))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(result -> assertNotNull(new JSONObject(result.getResponse().getContentAsString()).getString("accessToken")));
    }


    @Test
    public void givenValidRegister_whenRegisterAndLogin_thenStatusOK() throws Exception {
        String registerJson = getStringOfJsonFile("/json/auth/register.json");
        JSONObject register = new JSONObject(registerJson).getJSONObject("register");

        String responseRegisterString = mvc.perform(post("/auth/api/v1/register/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(register.toString()))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn()
                .getResponse()
                .getContentAsString();
        JSONObject registerResponse = new JSONObject(responseRegisterString);

        assertNotNull(registerResponse.getString("accessToken"));
        assertNotNull(registerResponse.getString("token"));

        JSONObject login = new JSONObject(registerJson).getJSONObject("login");

        JSONObject loginResponse = loginOkWithEmail(
                mvc,
                login.toString()
        );
        assertNotNull(loginResponse.getString("accessToken"));
        assertNotNull(loginResponse.getString("token"));

    }
    @Test
    public void givenValidLogin_whenLogout_thenCannotAccessUserInfoAndRefreshTokenFails() throws Exception {
        JSONObject login = loginOkWithEmail(
                mvc,
                getStringOfJsonFile("/json/auth/login.json")
        );
        String accessToken = login.getString("accessToken");
        String refreshToken = login.getString("token");

        mvc.perform(post("/auth/api/v1/logout")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print());

        mvc.perform(get("/auth/api/v1/user-info")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andDo(print());

        JSONObject refreshTokenRequest = new JSONObject();
        refreshTokenRequest.put("token", refreshToken);

        mvc.perform(post("/auth/api/v1/refreshToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshTokenRequest.toString()))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    @Test
    public void givenInvalidRegister_whenRegister_thenValidationErrors() throws Exception {
        String invalidRegisterJson = getStringOfJsonFile("/json/auth/invalid-register.json");
        JSONObject invalidRegistersObject = new JSONObject(invalidRegisterJson);

        JSONArray invalidRegisters = invalidRegistersObject.getJSONArray("invalidRegisters");
        for (int i = 0; i < invalidRegisters.length(); i++) {
            try {
                JSONObject item = invalidRegisters.getJSONObject(i);
                mvc.perform(post("/auth/api/v1/register/email")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(item.toString()))
                        .andExpect(status().isBadRequest())
                        .andDo(print())
                        .andExpect(result -> {
                            String responseString = result.getResponse().getContentAsString();
                            assertNotNull(responseString);
                        });

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void givenDuplicateEmail_whenRegister_thenConflict() throws Exception {
        // Leer el contenido del archivo JSON
        String duplicateRegisterJson = getStringOfJsonFile("/json/auth/duplicate-email-register.json");
        JSONObject duplicateRegister = new JSONObject(duplicateRegisterJson).getJSONObject("duplicateRegister");

        // Intentar registrar el usuario con email duplicado
        mvc.perform(post("/auth/api/v1/register/email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(duplicateRegister.toString()))
                .andExpect(status().isConflict())
                .andDo(print());
    }
}
