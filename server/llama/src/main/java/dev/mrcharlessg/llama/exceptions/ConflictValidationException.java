package dev.mrcharlessg.llama.exceptions;

public class ConflictValidationException extends ValidationException{
    public ConflictValidationException(String message) {
        super(message);
    }

    public ConflictValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
