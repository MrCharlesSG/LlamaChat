package dev.mrcharlessg.llama.service;

import dev.mrcharlessg.llama.domain.Chat;
import dev.mrcharlessg.llama.domain.Message;
import dev.mrcharlessg.llama.domain.UserDetails;
import dev.mrcharlessg.llama.dto.*;
import dev.mrcharlessg.llama.exceptions.ValidationException;
import dev.mrcharlessg.llama.repository.ChatRepository;
import dev.mrcharlessg.llama.repository.MessagesRepository;
import dev.mrcharlessg.llama.security.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@AllArgsConstructor
public class ChatService {

    private final OllamaChatModel ollamaChatClient;

    private static final String PROMPT_CONVERSATION_HISTORY_INSTRUCTIONS = """        
    The object `conversational_history` below represents the past interaction between the user and you (the LLM).
    Each `history_entry` is represented as a pair of `prompt` and `response`.
    `prompt` is a past user prompt and `response` was your response for that `prompt`.
        
    Use the information in `conversational_history` if you need to recall things from the conversation
    , or in other words, if the `user_main_prompt` needs any information from past `prompt` or `response`.
    If you don't need the `conversational_history` information, simply respond to the prompt with your built-in knowledge.
                
    `conversational_history`:
        
""";

    private AuthService authService;

    private ChatRepository chatRepository;

    private MessagesRepository messagesRepository;



    public List<ChatDTO> getAllChatsInfo() {
        UserDetails currentUser = authService.getCurrentUser();
        return chatRepository
                .findByUserEmail(currentUser.getEmail())
                .stream()
                .map(ChatDTO::new)
                .toList();
    }

    public Optional<ChatAndMessagesDTO> getChat(long id) {
        UserDetails currentUser = authService.getCurrentUser();

        return chatRepository
                .findByIdAndUserEmail(id, currentUser.getEmail())
                .map(ChatAndMessagesDTO::new);
    }

    public MessageDTO promptInChat(PromptDTO promptDTO, long idChat) throws ValidationException {
        UserDetails currentUser = authService.getCurrentUser();
        Chat chat = chatRepository
                .findByIdAndUserEmail(idChat, currentUser.getEmail())
                .orElseThrow(() -> new ValidationException("Chat does not exist"));

        StringBuilder historyPrompt = new StringBuilder(PROMPT_CONVERSATION_HISTORY_INSTRUCTIONS);
        List<Message> messages = chat.getMessages();
        messages.forEach(entry -> historyPrompt.append(entry.toString()));

        String promptFromUser = promptDTO.getMessage();

        SystemMessage contextSystemMessage = new SystemMessage(historyPrompt.toString());
        UserMessage currentPromptMessage = new UserMessage(promptFromUser);
        Prompt promptForModel = new Prompt(
                List.of(contextSystemMessage, currentPromptMessage),
                OllamaOptions
                        .builder()
                        .withFunction("getExchangeRates")
                        .withFunction(
                                "currentWeatherFunction"
                        )
                        .build()
        );


        String response = ollamaChatClient
                .call(promptForModel)
                .getResult()
                .getOutput()
                .getContent();

        String truncatedResponse = response.length() > 1000 ? response.substring(0, 1000) : response;
        Message message = Message.builder()
                .chat(chat)
                .prompt(promptFromUser)
                .response(truncatedResponse)
                .build();


        Message save = messagesRepository.save(message);

        return new MessageDTO(save);

    }

    @Transactional
    public void deleteChat(long id) throws ValidationException {
        UserDetails currentUser = authService.getCurrentUser();
        chatRepository
                .findByIdAndUserEmail(id, currentUser.getEmail())
                .orElseThrow(() -> new ValidationException("Couldn't find any chat with that id for the current user"));

        messagesRepository.deleteByChatId(id);
        chatRepository.deleteById(id);
    }

    public ChatDTO createChat(NewChatDTO newChatDTO) {
        UserDetails currentUser = authService.getCurrentUser();
        Chat chat = Chat
                .builder()
                .date(LocalDate.now())
                .messages(new ArrayList<>())
                .title(newChatDTO.getTitle())
                .user(currentUser)
                .build();

        Chat newChat = chatRepository.save(chat);
        return new ChatDTO(newChat);
    }
}
