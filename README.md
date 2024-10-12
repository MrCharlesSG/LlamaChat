<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->
# LamaChat Documentation

- [1. Introduction](#1-introduction)
   * [1.1. Overview](#11-overview)
   * [1.2. Purpose](#12-purpose)
   * [1.3. Features](#13-features)
- [2. Project Structure](#2-project-structure)
   * [2.1. Server (Spring Boot)](#21-server-spring-boot)
   * [2.2. Frontend (Next.js)](#22-frontend-nextjs)
- [3. Getting Started](#3-getting-started)
- [4. Spring Architecture](#4-spring-architecture)
   * [4.1. Authentication](#41-authentication)
      + [**4.1.1. Short-lived `accessToken`**](#411-short-lived-accesstoken)
      + [**4.1.2. Long-lived `token`**](#412-long-lived-token)
      + [**4.1.3. Refreshing the `accessToken`**](#413-refreshing-the-accesstoken)
   * [4.2. OAuth 2 Integration with GitHub](#42-oauth-2-integration-with-github)
      + [4.2.1. Authentication Flow](#421-authentication-flow)
      + [4.2.2. Implementation Details](#422-implementation-details)
      + [4.2.3. Key Components](#423-key-components)
   * [4.3. AI Integration](#43-ai-integration)
      + [4.3.1. AI Functions](#431-ai-functions)
      + [4.3.2. Code Implementation](#432-code-implementation)
   * [4.4. Domain](#44-domain)
- [5. Next.js Architecture](#5-nextjs-architecture)
   * [5.1. Authentication Flow](#51-authentication-flow)
      + [5.1.1. Middleware](#511-middleware)
      + [5.1.2. Token Management](#512-token-management)
   * [5.2. Chat Functionality](#52-chat-functionality)
   * [5.3. **Handling REST API Reponses**](#53-handling-rest-api-reponses)
   * [5.4. Appearance](#54-appearance)

<!-- TOC end -->

<!-- TOC --><a name="1-introduction"></a>
# 1. Introduction

<!-- TOC --><a name="11-overview"></a>
## 1.1. Overview

This project is a comprehensive web application that integrates a Spring Boot backend with a Next.js (React-based) frontend to offer a seamless user experience for managing chatbot interactions. The chatbot can provide real-time currency exchange rates and weather information for cities worldwide.

The backend is powered by a RESTful API, handling authentication via JWT tokens, allowing users to log in either through their email or GitHub accounts. The frontend, built with Next.js, delivers an intuitive and responsive web interface, ensuring accessibility and ease of use.

<!-- TOC --><a name="12-purpose"></a>
## 1.2. Purpose

This project was developed with three primary goals in mind:

1. **Exploring the Spring AI Framework**: A key objective was to experiment with the new Spring AI framework, which enables developers to integrate Large Language Models (LLMs) with a Spring Boot server for advanced AI capabilities.
2. **Implementing OAuth 2.0 Authentication**: In today's digital landscape, secure and seamless authentication is essential. This project integrates OAuth 2.0 to allow users to log in using their GitHub accounts, enhancing security and user convenience.
3. **Building a Real-world Application with Next.js**: Finally, this project served as a practical implementation of the Next.js framework, demonstrating how to build and consume a full-featured web app powered by a Spring Boot backend.

This documentation is intended for anyone interested in learning about or replicating this project. It is particularly useful for developers seeking to integrate AI, OAuth 2.0, and JWT authentication with Spring Boot and Next.js.

<!-- TOC --><a name="13-features"></a>
## 1.3. Features

The application supports the following key user stories:

1. As a user, I want to log in or register using my GitHub account, so I can quickly access the application without remembering additional credentials.
2. As a user, I want the option to log in or register using my email, so I can choose a method that suits my preferences and maintain flexibility in authentication.
3. As a user, I want the ability to log out from my session regardless of how I logged in, so I can ensure my account remains secure when I am not using the application.
4. As a user, I want to create or delete chats, so I can manage my conversations with the chatbot effectively and keep my interface organized.
5. As a user, I want to send prompts to the chatbot, so I can receive tailored responses based on real-time data, enhancing my interactive experience.
6. As a user, I want to obtain up-to-date weather information for any city, so I can make informed decisions based on current weather conditions.
7. As a user, I want access to current currency exchange rates, so I can stay informed about financial trends and make better economic choices.

<!-- TOC --><a name="2-project-structure"></a>
# 2. Project Structure

<!-- TOC --><a name="21-server-spring-boot"></a>
## 2.1. Server (Spring Boot)

- **Repository Link**
    - https://github.com/MrCharlesSG/LlamaChat/tree/main/server/llama
- **Overview**
    - **Description**: The backend is responsible for handling all business logic and data persistence. It exposes RESTful APIs consumed by the frontends.
    - **Architecture**: Follows the layered architecture pattern with controllers, services, and repositories.
    - **Key Components**:
        - **Controllers**: Handle HTTP requests and responses.
        - **Services**: Contain business logic and interact with repositories.
        - **Repositories**: Interface with the database using JPA.
        - **Domain**: Define the data model and map to database tables.
        - **AiFunction:** allows the model to access rela-time data
    - **Technologies**:
        - Spring Boot
        - Spring AI
        - OAuth 2
        - Hibernate
        - JWT for security
        - Mock H2 for the database

<!-- TOC --><a name="22-frontend-nextjs"></a>
## 2.2. Frontend (Next.js)

- **Repository Link**
    - https://github.com/MrCharlesSG/LlamaChat/tree/main/next-frontend
- **Overview**
    - **Description**: The frontend is designed to provide a user-friendly interface for interacting with the chatbot. It communicates with the Spring Boot backend via RESTful APIs to fetch and display data.
    - **Architecture**: Built using a component-based architecture, allowing for reusable UI components and efficient state management. The styles are done in the vast majority in Tailwind CSS.
    - **Key Components**:
        - **Pages**: Represent different routes in the application, including login, registration, and chat views.
        - **Components**: Reusable UI elements such as chat windows, input forms, and buttons.
        - **API Calls**: Functions that handle communication with the backend, including user authentication and data retrieval.
        - **State Management**: Utilizes hooks and context API for managing application state and user sessions.
    - **Technologies**:
        - Next.js
        - React
        - Axios for API calls
        - Tailwind CSS for styling
        - Context API for state management

<!-- TOC --><a name="3-getting-started"></a>
# 3. Getting Started

The application can not be cloned an run easily since it is needed some private keys for accessing service such us the OAuth with Github or the Weather API for the real-time data.

<!-- TOC --><a name="4-spring-architecture"></a>
# 4. Spring Architecture

The structure of the server  follows the layered architecture pattern with controllers, services, and repositories. In this section will be explained the key functions of the application. 

<!-- TOC --><a name="41-authentication"></a>
## 4.1. Authentication

All endpoints in the database but the login and register and refresh token are protected endpoints. This means that every client of the server needs to  provide a header with the keyword  **`Authorization`** and the value **`Bearer *accessToken*`**.

<aside>
💡

The OAuth is explained in next section

</aside>

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. In this project, JWT is used to manage user authentication and authorization.

Upon successful login or registration, the user receives a data structure like this:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTY0Nzk4OTU4NX0.Dw7U2YOZH8F4-tUNr1ZQV3QntTe19VR6FN5W_mmfT3s",
  "token": "dGhpcyBpcyBhIHNhbXBsZSB0b2tlbg=="
}
```

When registering, the user also receives their information wrapped in a wrapper.

The **`accessToken`** allows the user to access protected endpoints. However, it is valid for only 10 minutes, while the **`token`** is valid for seven days. Here’s why:

<!-- TOC --><a name="411-short-lived-accesstoken"></a>
### **4.1.1. Short-lived `accessToken`**

The **`accessToken`** is valid for 10 minutes to minimize security risks. Since the **`accessToken`** is used frequently in almost every request to protected endpoints, there is a higher risk of it being intercepted or stolen. By limiting its lifespan, the window of opportunity for an attacker to use a stolen token is significantly reduced, enhancing overall security.

<!-- TOC --><a name="412-long-lived-token"></a>
### **4.1.2. Long-lived `token`**

The **`token`**, on the other hand, is valid for seven days. This longer lifespan provides a more convenient user experience. Users don’t have to log in repeatedly throughout the day. Instead, they can use the **`token`** to refresh their **`accessToken`** when it expires. This way, users only need to log in once a week, balancing security and convenience.

<!-- TOC --><a name="413-refreshing-the-accesstoken"></a>
### **4.1.3. Refreshing the `accessToken`**

To refresh the **`accessToken`**, the user calls the **`/auth/api/v1/refreshToken`** endpoint with the **`token`** in the request body. This process extends the user's session without requiring them to re-enter their credentials frequently, thus maintaining a seamless and secure user experience.

**Sequence Charts in Backend**

**Login**

![login](https://github.com/user-attachments/assets/3ffe55ec-e0dd-4266-909c-591dbb4a4ad0)


**Register**

![register](https://github.com/user-attachments/assets/27e3fb5f-46ab-4559-80e7-2ce9e598514c)


**Refresh Token**

![token](https://github.com/user-attachments/assets/7393d045-c90e-433b-ab09-bd728ac5f7ec)


<!-- TOC --><a name="42-oauth-2-integration-with-github"></a>
## 4.2. OAuth 2 Integration with GitHub

<!-- TOC --><a name="421-authentication-flow"></a>
### 4.2.1. Authentication Flow

This project follows GitHub's recommended OAuth 2.0 flow for web applications to manage authentication. The process ensures secure authorization, leveraging GitHub as an identity provider. The flow is outlined below:

1. The user initiates login, and the frontend redirects them to `{serverURL}/oauth2/authorization/github`.
2. The server, in turn, redirects the user to GitHub’s authorization endpoint at [`https://github.com/login/oauth/authorize`](https://github.com/login/oauth/authorize), passing parameters such as the client ID, redirect URI, and client secret.
3. GitHub displays an authorization page where the user enters their credentials and grants permissions to the application.
4. After a successful login and authorization, GitHub redirects the user back to the server’s callback URL: `{serverURL}/oauth2/callback/github`. This redirect includes an authorization `code` as a parameter.
5. The server uses this `code` to request an access token from GitHub.
6. Once the access token is received, the server retrieves the user’s information from GitHub, acting on behalf of the authenticated user.
7. The server then redirects the user back to the frontend, sending the authentication tokens (such as access and refresh tokens) as parameters.
8. The frontend stores these tokens (usually in cookies) and grants the user access to protected resources.

![oauth](https://github.com/user-attachments/assets/6abe2deb-971c-4654-a4c5-949cd0588d44)

<!-- TOC --><a name="422-implementation-details"></a>
### 4.2.2. Implementation Details

The server plays a key role in managing this OAuth 2.0 flow. Its responsibilities include:

1. **Redirecting the user to GitHub’s authorization page**.
2. **Handling the callback** from GitHub after successful authentication.
3. **Fetching the user’s information** using the access token.
4. **Redirecting to the frontend** with the necessary tokens for further processing.

Spring Security simplifies much of this workflow through built-in support for OAuth 2.0, requiring developers to provide minimal configuration details for GitHub as an authentication provider in the `application.properties` file:

```
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.scope=user:email
spring.security.oauth2.client.registration.github.redirect-uri=http://localhost:1244/oauth2/callback/github
spring.security.oauth2.client.provider.github.authorization-uri=https://github.com/login/oauth/authorize
spring.security.oauth2.client.provider.github.token-uri=https://github.com/login/oauth/access_token
spring.security.oauth2.client.provider.github.user-info-uri=https://api.github.com/user
spring.security.oauth2.client.provider.github.user-name-attribute=id

```

Although much of the OAuth 2.0 process is automated by Spring Security, developers are still responsible for customizing key aspects to fit their business logic.

<!-- TOC --><a name="423-key-components"></a>
### 4.2.3. Key Components

<!-- TOC --><a name="securityconfig-class"></a>
### **`SecurityConfig` Class**

The `SecurityConfig` class manages the security settings for the application, including the configuration of OAuth 2.0 authentication. A critical part of this setup is defining a `SuccessHandler` to handle what happens after a user successfully authenticates. This handler is where the business logic for token generation and redirection to the frontend occurs.

In this configuration, we specify authorization rules, disable CORS and CSRF where appropriate, and set up OAuth 2.0 login behavior. The `authorizationEndpoint` stores information like the frontend redirection URI and loads the authorization request.

In this specific project, the `HttpCookieOAuth2AuthorizationRequestRepository` is not used because enabling CORS and extra permissions would be required, making it unnecessary for this implementation.

```java
@Configuration
public class SecurityConfig {
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/auth/api/v1/login/**").permitAll()
                .requestMatchers("/auth/api/v1/register/**").permitAll()
                .requestMatchers("/auth/api/v1/logout").authenticated()
                .requestMatchers("/auth/api/v1/refreshToken").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth
                    .baseUri("/oauth2/authorization")
                    .authorizationRequestRepository(cookieAuthorizationRequestRepository)
                )
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/oauth2/callback/*")
                )
                .successHandler(oAuth2AuthenticationSuccessHandler)
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    // Other configuration methods...
}
```

<!-- TOC --><a name="oauth2-authentication-success-handler"></a>
### **OAuth2 Authentication Success Handler**

The `OAuth2AuthenticationSuccessHandler` is responsible for executing custom business logic after the user successfully authenticates with GitHub. This includes fetching user details, creating a new user if needed, generating the JWT tokens, and redirecting the user to the frontend with the tokens.

```java
@Component
@AllArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // Retrieve or create user based on GitHub login
        String email = oauthUser.getAttribute("login");
        Optional<UserInfo> userOpt = userRepository.findByUsername(email);
        UserInfo user = userOpt.orElseGet(() -> saveUser(oauthUser));

        // Generate JWT access and refresh tokens
        JwtResponseDTO tokens = refreshTokenService.createRefreshTokenAndToken(user.getUsername());

        // Frontend redirection URI (e.g., stored in cookies)
        String targetUrl = "<http://localhost:3000/oauth/callback/github>";

        // Append the tokens to the redirection URL
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("accessToken", tokens.getAccessToken())
                .queryParam("refreshToken", tokens.getToken())
                .build().toUriString();

        // Redirect the user to the frontend with the tokens
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // Helper method to save the user in the database
    private UserInfo saveUser(OAuth2User oauthUser) {
        // Save user logic
    }
}
```

This handler ensures that, upon successful GitHub authentication, the server processes the user’s details, generates the necessary tokens (JWT access and refresh tokens), and then securely redirects the user back to the frontend application, providing them with access to protected resources.

<!-- TOC --><a name="43-ai-integration"></a>
## 4.3. AI Integration

The backend of the application integrates Meta's LLaMA 3.1 model, a state-of-the-art generative model from Meta (formerly Facebook). Integrating this model into the Spring Boot application is straightforward. By simply configuring the model in the `application.properties` file, as shown below, the LLaMA 3.1 model becomes ready for use.

```
spring.ai.ollama.chat.model=llama3.1
```

This configuration allows easy access to the model within the service layer. The model can be invoked seamlessly, as illustrated in the following example (details about the `promptForModel` will be explained later, but this demonstrates the simplicity of the integration):

```java
@Service
@AllArgsConstructor
public class ChatService {

    private final OllamaChatModel ollamaChatClient;

    public MessageDTO promptInChat(PromptDTO promptDTO, long idChat) throws ValidationException {
        ...
        String response = ollamaChatClient
                .call(promptForModel)
                .getResult()
                .getOutput()
                .getContent();
        ...
    }
}
```

<!-- TOC --><a name="431-ai-functions"></a>
### 4.3.1. AI Functions

AI Functions extend the capabilities of the LLaMA model, allowing it to retrieve external information, such as weather data and currency exchange rates, which the model wouldn't have access to natively. This workflow enables dynamic data fetching during chatbot interactions and is crucial for this project’s use cases, including real-time weather updates and currency exchange queries.

The workflow for using functions in the LLaMA model is as follows:

1. The client defines the required functions, providing both their names and descriptions, and also crafts the prompt.
2. When necessary, the model decides whether to call one or more functions, sending a JSON-encoded string with the required parameters.
3. The function parses the JSON parameters and executes the required task (e.g., calling an API to get exchange rates).
4. The function’s result is combined with the user query and the conversation history.
5.  The model then processes this information and formulates a response to be returned to the client.

![Models Functions-2](https://github.com/user-attachments/assets/4171d97c-1ecb-4dd9-92e6-e5e67e95824f)

<!-- TOC --><a name="432-code-implementation"></a>
### 4.3.2. Code Implementation

1. Each function is defined and registered as a Spring bean, specifying its name and description. For example, the function to fetch exchange rates is defined as follows:
    
    ```java
    @Configuration
    public class FunctionConfiguration {
    
        private final ExchangeConfigProperties propsExchange;
    
        @Bean
        @Description("Fetches the exchange rates for a specified date (in YYYY-MM-DD format), base currency, and target currencies. " +
                "The currencies must be abbreviated (e.g., EUR, USD, CHF, CAD, GBP, MXN, etc.).")
        public Function<ExchangeHistoricalService.Request, ExchangeHistoricalService.Response> getExchangeRates() {
            return new ExchangeHistoricalService(propsExchange);
        }
    }
    ```
    
2. The function fetches the required data (e.g., calling an API). Here’s the implementation of the `getExchangeRates` function, which retrieves historical exchange rates by making an external API call:
    
    ```java
    public class ExchangeHistoricalService extends ExchangeService
        implements Function<ExchangeHistoricalService.Request, ExchangeHistoricalService.Response> {
    
        private static final Logger log = LoggerFactory.getLogger(ExchangeService.class);
    
        public ExchangeHistoricalService(ExchangeConfigProperties props) {
            super(props);
        }
    
        @Override
        public ExchangeHistoricalService.Response apply(ExchangeHistoricalService.Request exchangeRequest) {
            log.info("Received Exchange Historical Request: {}", exchangeRequest);
    
            // Validate the request
            if (!validateRequest(exchangeRequest)) {
                return null;
            }
    
            String uri = String.format("%s/%s?base=%s&symbols=%s",
                    exchangeProps.apiUrl(),
                    exchangeRequest.date(),
                    exchangeRequest.baseCurrency(),
                    exchangeRequest.targetCurrencies());
    
            log.debug("Formatted Exchange API URI: {}", uri);
    
            try {
                ExchangeHistoricalService.Response response =
                    restTemplate.getForObject(uri, ExchangeHistoricalService.Response.class);
                log.info("Exchange API Response: {}", response);
                return response;
            } catch (HttpStatusCodeException ex) {
                log.error("Error calling exchange API: Status code = {}, Response = {}",
                          ex.getStatusCode(), ex.getResponseBodyAsString());
                throw new IllegalStateException("Error occurred while fetching exchange rates", ex);
            } catch (Exception ex) {
                log.error("General error in fetching exchange rates", ex);
                throw new IllegalStateException("An unexpected error occurred", ex);
            }
        }
    }
    ```
    
3. When a user prompts the chatbot, the conversation history and required functions are set in the prompt instance. The model processes this information, generates the appropriate response, and the message is then saved.
    
    ```java
    @Service
    @AllArgsConstructor
    public class ChatService {
    
        private final OllamaChatModel ollamaChatClient;
    
        public MessageDTO promptInChat(PromptDTO promptDTO, long idChat) throws ValidationException {
            UserDetails currentUser = authService.getCurrentUser();
            Chat chat = chatRepository
                    .findByIdAndUserEmail(idChat, currentUser.getEmail())
                    .orElseThrow(() -> new ValidationException("Chat does not exist"));
    
            // Build conversation history
            StringBuilder historyPrompt = new StringBuilder(PROMPT_CONVERSATION_HISTORY_INSTRUCTIONS);
            chat.getMessages().forEach(entry -> historyPrompt.append(entry.toString()));
    
            String promptFromUser = promptDTO.getMessage();
            SystemMessage contextSystemMessage = new SystemMessage(historyPrompt.toString());
            UserMessage currentPromptMessage = new UserMessage(promptFromUser);
    
            // Configure functions in the prompt
            Prompt promptForModel = new Prompt(
                    List.of(contextSystemMessage, currentPromptMessage),
                    OllamaOptions
                        .builder()
                        .withFunction("getExchangeRates")
                        .withFunction("currentWeatherFunction")
                        .build()
            );
    
            // Call the model and get response
            String response = ollamaChatClient
                    .call(promptForModel)
                    .getResult()
                    .getOutput()
                    .getContent();
    
            // Truncate the response to avoid excessive length
            String truncatedResponse = response.length() > 1000 ? response.substring(0, 1000) : response;
    
            // Save and return the message
            Message message = Message.builder()
                    .chat(chat)
                    .prompt(promptFromUser)
                    .response(truncatedResponse)
                    .build();
    
            Message savedMessage = messagesRepository.save(message);
            return new MessageDTO(savedMessage);
        }
    }
    ```
    

<!-- TOC --><a name="44-domain"></a>
## 4.4. Domain

![domain](https://github.com/user-attachments/assets/02075c4d-70e5-4412-94a7-de753eccfd93)

<!-- TOC --><a name="5-nextjs-architecture"></a>
# 5. Next.js Architecture

The Next.js frontend is a responsive web application designed to provide users with seamless interaction. It leverages component-based architecture, where reusable components are built to structure the user interface (UI). The architecture includes state management for chat functionality, middleware for authentication, and integration with REST APIs for backend communication.  Below is an overview of the main elements of the architecture.

<!-- TOC --><a name="51-authentication-flow"></a>
## 5.1. Authentication Flow

The application secures protected routes through a robust authentication flow, ensuring that only authenticated users can access sensitive pages. This flow is governed by a middleware function that verifies the presence of valid tokens before granting access to certain pages.

<!-- TOC --><a name="511-middleware"></a>
### 5.1.1. Middleware

In `middleware.js`, the application defines protected and public routes. The middleware intercepts every incoming request to validate the user’s session status. Protected routes (e.g., `/chat`, `/profile`) are restricted to authenticated users, while public routes (e.g., `/login`, `/signup`) are accessible without authentication.

- If a user tries to access a protected route without a valid session cookie, they are redirected to the login page.
- Conversely, if an authenticated user attempts to access a public route, they are redirected to the chat page.

This ensures smooth navigation while maintaining security, as users are automatically routed based on their session status.

<!-- TOC --><a name="512-token-management"></a>
### 5.1.2. Token Management

When ever we want to make an authenticated request to the server we will need the authentication header. This header is the already mention `Bearer accessToken`.  This `accessToken` is stored in the cookies in every session login or register with the `token` and the `lastRefresh` (instant when the `accesssToken` was refreshed). 

The process of getting the **authentication header** is as follows:

1. Get the stored tokens 
2. If `token` is expired (cookies has expired so cannot retrieve the tokens) then redirect to `/login`.
3. If `accessToken` is expired, then is refreshed making the call to the server
4. The access token is returned in the `Bearer accessToken` format.

<!-- TOC --><a name="52-chat-functionality"></a>
## 5.2. Chat Functionality

The chat functionality is a key feature of the application and is powered by a global state management context, `ChatProvider`. This provider is responsible for handling chat-specific states, such as the currently selected chat, the state of message sending, and controlling the chat flow between different components.

The `ChatProvider` creates a global state for chat-related data, which includes the `selectedChatId` (the ID of the currently selected chat) and a flag to indicate whether a message is currently being sent (`onSending`). The global state is accessible throughout the application via the `useChat` hook, ensuring that components can share and update chat-related information.

<!-- TOC --><a name="53-handling-rest-api-reponses"></a>
## 5.3. **Handling REST API Reponses**

In Next.js, the `/api` routes allow the frontend to interact with the backend services through server-side functions, acting as an intermediary layer between the client and the backend. These routes are part of the API layer exposed by Next.js itself and are useful for handling backend logic, making external requests, and responding to frontend requests.
It uses `axios` to interact with the external backend API and manages responses within the Next.js API route.

For example, if we wanted to send a message and receive the response to the chat with id 5:

1. The user submits a message via the chat interface.
2. The frontend sends the `POST` request to `/api/chat/`5, which includes the message body and the chat ID.
3. The API route in Next.js retrieves the **authentication header** (using the `getAuthHeader()` function), formats it as `Bearer accessToken`, and forwards the request to the external backend endpoint (`BACKEND_URL/chat/`5).
4. The response from the external backend is returned to the frontend in JSON format.

The advantages of this approach are

- **Simplified Client-Server Communication**: By using Next.js API routes, the frontend interacts with the `/api` endpoints rather than directly with the external backend. This abstracts the backend complexity and centralizes request handling within the Next.js app.
- **Security**: API routes allow sensitive logic (e.g., attaching authentication tokens) to be handled server-side, away from the frontend, ensuring that sensitive data like access tokens are not exposed.
- **Modularity**: By creating specific API routes for different functionalities, such as `/api/chat`, the codebase remains modular and easier to maintain.

<!-- TOC --><a name="54-appearance"></a>
## 5.4. Appearance

![frontend-4](https://github.com/user-attachments/assets/9d19b7ac-805d-44eb-81f0-ed2dd024f201)
![frontend-3](https://github.com/user-attachments/assets/bbc69c17-8ab5-4040-b586-c4655340a85d)
![frontend-2](https://github.com/user-attachments/assets/166d1da3-b744-4d8e-b27a-176031ff9a41)
![frontend-1](https://github.com/user-attachments/assets/ba97c95d-eb52-4813-8ede-e1a2ca267106)

