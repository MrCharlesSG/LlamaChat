"use client";
import { promptMessage } from "@/lib/chat";
import React, { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im"; 
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { LuSendHorizonal } from "react-icons/lu";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useChat } from "@/hooks/useChat";

function PromptInput({ setMessages }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false); 
  const textareaRef = useRef(null);
  const { selectedChatId, onSending, setOnSending } = useChat();

  const handleInputChange = (e) => {
    handleChangeText(e.target.value);
  };

  const handleChangeText = (newText) => {
    const textarea = textareaRef.current;
    setText(newText);

    if (newText === "") {
      textarea.style.height = "24px"; // Altura correspondiente a una línea
    } else {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`; // Máximo 3 líneas
    }
  };

  const onSubmit = async () => {
    setOnSending(true);
    if (text.trim() === "") {
      setOnSending(false);
      return;
    }

    try {
      const response = await axios.post("api/chat/" +selectedChatId , {message:text})
      console.log("La respuesta del chat = ",response.data.data)
      setMessages((messages) => {
        if (messages[0].isEmptyChat) {
          return [response.data.data];
        } else {
          return [...messages, response.data.data];
        }
      });
      handleChangeText("");
    } catch (error) {
      console.error("Error enviando el mensaje:", error);
      toast.error("Couldn't send the message");
    } finally {
      setOnSending(false);
    }
  };

  // Detecta cuando se presiona "Enter" y envía el mensaje
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evitar el salto de línea
      setIsFocused(false)
      onSubmit(); // Enviar el mensaje
    }
  };

  return (
    <>
      <div
        className={`flex shadow-sm shadow-background_third items-center bg-background_secondary p-3 border-2 transition-all duration-200 ${
          isFocused ? "border-exalt_second" : "border-background_third"
        } ${onSending && " border-exalt"}`} 
      >
        <textarea
          ref={textareaRef}
          rows="1"
          className="pl-5 bg-transparent focus:outline-none w-full resize-none overflow-auto"
          value={text}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          style={{ lineHeight: "24px" }}
          disabled={onSending || selectedChatId==null}
          onFocus={() => setIsFocused(true)} // Cambia el estado de foco a true
          onBlur={() => setIsFocused(false)}  // Cambia el estado de foco a false
          onKeyDown={handleKeyDown} // Detectar cuando se presiona una tecla
        />
        {onSending ? (
          <div className="ml-2 flex items-center">
            <ImSpinner8 className="animate-spin text-exalt_second text-2xl" />
          </div>
        ) : (
          <button
            onClick={onSubmit}
            className="ml-2 "
            disabled={onSending || text.trim() === ""}
          >
            <RiSendPlane2Fill className="hover:text-exalt_second text-exalt text-2xl cursor-pointer" />
          </button>
        )}
      </div>
      <ToastContainer
        className={"z-100"}
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default PromptInput;
