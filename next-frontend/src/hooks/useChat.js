"use client";
import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedChatId, setSelectedChatIdState] = useState(null);
  const [onSending, setOnSending] = useState(false);

  const setSelectedChatId = (chatId) => {
    if (!onSending) {
      setSelectedChatIdState(chatId);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChatId,
        setSelectedChatId,
        onSending,
        setOnSending,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
