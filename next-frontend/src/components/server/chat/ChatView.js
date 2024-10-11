"use client";
import Messages from "@/components/server/chat/Messages";
import Prompt from "@/components/server/chat/Prompt";
import { useChat } from "@/hooks/useChat";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LoadingDots from "../ui/LoadingDots";
import { FaArrowDown } from "react-icons/fa";

function ChatView() {
  const [messages, setMessages] = useState([
    {
      isEmptyChat: true,
      message: "Cannot see my chats",
      response: "It is because there are no chats selected",
    },
  ]);
  const [chatInfo, setChatInfo] = useState({});
  const { selectedChatId } = useChat();
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null); // Referencia al contenedor de mensajes
  const [showScrollToBottom, setShowScrollToBottom] = useState(false); // Estado para mostrar/ocultar la flecha

  const fetchMessages = async (chatID) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/chat/" + chatID);
      const newChat = response.data.data;
      setChatInfo(newChat.chatInfo);

      if (newChat.messages.length < 1) {
        setMessages([
          {
            isEmptyChat: true,
            message: "There are no chats on the screen",
            response: "You should try to refresh the app or to send a message",
          },
        ]);
      } else {
        setMessages(newChat.messages);
      }
    } catch (error) {
      setChatInfo({});
      setMessages([
        {
          message: "Something went wrong fetching the chat",
          response: "You should try to refresh the app",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    } else {
      setMessages([
        {
          isEmptyChat: true,
          message: "Cannot see my chats",
          response: "It is because there are no chats selected",
        },
      ]);
    }
  }, [selectedChatId]);

  // Desplazar el contenedor al final cuando se carguen nuevos mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Función para manejar el scroll y mostrar la flecha si el usuario no está en la parte inferior
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    // Si el usuario no está en la parte inferior, mostrar el botón de "scroll to bottom"
    if (container && container.scrollHeight - container.scrollTop > container.clientHeight + 100) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  // Función para desplazarse hacia el final del contenedor
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      className="pl-6 w-full h-full bg-background relative overflow-y-auto"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {loading ? (
        <LoadingDots />
      ) : (
        <>
          {/* Contenedor de mensajes con scroll */}
          <Messages messages={messages} />

          {/* Flecha para ir al final */}
          {showScrollToBottom && (
            <button
              className="fixed right-8 bottom-16 border-2 border-background_third p-2 text-exalt bg-transparent hover:bg-background_secondary shadow-lg transition-colors"
              onClick={scrollToBottom}
            >
              <FaArrowDown size={20} />
            </button>
          )}

          <Prompt setMessages={setMessages} />
        </>
      )}
    </div>
  );
}

export default ChatView;
