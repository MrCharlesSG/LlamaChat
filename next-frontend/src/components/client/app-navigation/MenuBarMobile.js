"use client";
import React, {useState} from "react";
import Link from "next/link";
import { FiMenu  } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { HiMenuAlt2 as Icon } from "react-icons/hi";
import { IoTrashBin } from "react-icons/io5";
import { useChat } from "@/hooks/useChat";
import Modal from "@/components/server/ui/Modal";
import LoadingDots from "@/components/server/ui/LoadingDots";
import axios from "axios";
import Logo from "../../server/ui/Logo";


export default function MenuBarMobile({ setter }) {
  
  const { setSelectedChatId, selectedChatId } = useChat();
  const [showDeleteConfirmation, setShowDeleteConfimation] = useState(false)
  const [isDeleting, setIsDeleting] = useState()

  const handleDeleteChat =  async () => {
    try{
      setIsDeleting(true)
      await axios.delete("/api/chat/"+ selectedChatId)
      setSelectedChatId(null)
    }catch(error){
      console.log(error)
    }finally{
      setIsDeleting(false)
      setShowDeleteConfimation(false)
    }
  }


  return (
    <nav className=" bg-background  z-20 w-full  rounded-lg fixed top-0 left-0 right-0 h-[60px] flex [&>*]:my-auto px-2">
      <button
        className="text-4xl absolute md:hidden top-3 flex hover:text-exalt text-white"
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
      >
        <Icon />
      </button>
      <div className=" md:ml-72 w-full flex justify-center items-center">
      <Logo />
      </div>
      <button
        title="Delete the current chat"
        className={`text-3xl absolute top-3 right-3 flex hover:text-exalt text-white ${selectedChatId==null && " hidden"}`}
        onClick={() => setShowDeleteConfimation(true)}
      >
        <IoTrashBin />
      </button>
      {
        showDeleteConfirmation &&
        <Modal
          onClose={() => setShowDeleteConfimation(false)}
        >
          <div 
            className=" gap-3 flex flex-col justify-center bg-background_secondary p-3 w-full border-2 border-background_third shadow-sm shadow-background_third" 
          >
            <p>Do you want to DELETE this chat<span className="text-danger-600"> FOREVER</span></p>
            <button 
              className="w-full shadow-sm hover:scale-105 bg-danger_color transition-all duration-500" 
              onClick={handleDeleteChat}
            >delete</button>
                {
                  isDeleting &&
                  <LoadingDots 
                    text="deleting"
                  />
                }
          </div>
        </Modal>
      }
    </nav>
  );
}
