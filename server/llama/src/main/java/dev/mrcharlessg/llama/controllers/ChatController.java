package dev.mrcharlessg.llama.controllers;

import dev.mrcharlessg.llama.dto.*;
import dev.mrcharlessg.llama.exceptions.ValidationException;
import dev.mrcharlessg.llama.service.ChatService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController()
@RequestMapping("chat")
@AllArgsConstructor
public class ChatController {

    private final ChatService chatService;


    @GetMapping()
    public List<ChatDTO> getAllChatsInfo(){
        return chatService.getAllChatsInfo();
    }

    @GetMapping("{id}")
    public ChatAndMessagesDTO getChat(@PathVariable long id){
        return chatService
                .getChat(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find chat with this id (" + id + ") for the current user"));
    }

    @PostMapping("{idChat}")
    public MessageDTO promptMessage(@PathVariable long idChat, @RequestBody PromptDTO prompt){
        try {
            return chatService.promptInChat(prompt, idChat);
        } catch (ValidationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    public void deleteChat(@PathVariable long id){
        try {
            chatService.deleteChat(id);
        } catch (ValidationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }


    @PostMapping("/new-chat")
    public ChatDTO createChat(@RequestBody NewChatDTO newChat){
        if(newChat.getTitle().isBlank()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title must not be blank");
        }
        return chatService.createChat(newChat);
    }



}
