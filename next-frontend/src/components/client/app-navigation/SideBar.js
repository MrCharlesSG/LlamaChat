"use client";
// @/components/Layout/Sidebar.js
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { useEffect, useState } from 'react';
import axios from "axios";
import { formatDate } from "@/utils/stringFormaters";
import { useChat } from "@/hooks/useChat";
import LoadingDots from "@/components/server/ui/LoadingDots";
import Modal from "@/components/server/ui/Modal";
import LabelInput from "@/components/server/ui/LabelInput";
import { redirect, useRouter } from 'next/navigation';






export default function Sidebar({ show, setter }) {
  const router = useRouter()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true); 
  const { setSelectedChatId, selectedChatId } = useChat();
  const [showAdd, setShowAdd] = useState(false)
  const [submittingForm, setSubmittingForm] = useState(false)
 
  const fetchChats = async () => {
    try {
      setLoading(true)
      console.log("----Sending for chats...")
      const response = await axios.get("/api/chat");
      const newChats = response.data.data
      console.log("----Recibing Chats ", newChats)
      setChats(newChats)
    } catch (error) {
      setChats([])
    } finally {
      setLoading(false)
    }
    
  }

  useEffect(() => {
    console.log("------fetching chats")
    fetchChats();
  }, [])

  useEffect(() => {
    if (selectedChatId==null) {
      console.log("------fetching chats")
      fetchChats();
    }
  }, [selectedChatId]);

  const handleOnAdd = async () => {
    setShowAdd(true)
  }


  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  const MenuItem = ({ chat }) => {
    return (
      <button className =" px-2" onClick={() => loadChat(chat.id)}>
      <div className={` flex p-2 flex-col items-start border-2 hover:bg-background mb-1
      border-background_secondary bg-trasparent
      hover:border-background_third ${chat.id === selectedChatId ? " border-background_third" : " border-b-background"} `}>
        <p className={`overflow-hidden text-ellipsis whitespace-nowrap 
        ${chat.id === selectedChatId ? " text-exalt":" text-white"}`}
          style={{ maxWidth: '100%' }}>{chat.title}</p>
        <p className={`text-sm ${chat.id === selectedChatId ? " text-exalt-light":" text-exalt_second-light"} `}>{formatDate(chat.date)}</p>
      </div>
      </button>
    );
  };

  const loadChat = (id) => {
    setSelectedChatId(id)
  }

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  );

  async function handleSubmitNewChat(event)  {
    setSubmittingForm(true)
    const formData = new FormData(event.currentTarget)
    const chatData = {
      title : formData.get('title'),
    }

    console.log("New chat data " +JSON.stringify(chatData))
    
        try {
          const response = await axios.post("/api/chat/create", chatData, {
            headers: {
              'Content-Type': 'application/json', 
            },
          })
          console.log("response of new chat:",response)
            if (response.data.success) {
              
              setChats([...chats, response.data.data])
            } else {
              
                toast.error("Couldn't create chat");
            }
        } catch (error) {
          console.log(error)
            toast.error("Error Creating Chat: " +  error.message);
        }finally{
          setSubmittingForm(false)
          setShowAdd(false)
        }
  }

  return (
    <>
     <div className={` ${appendClass} bg-background_secondary w-[250px] pb-10 transition-[margin-left] ease-in-out duration-500 fixed md:fixed left-0 top-0 z-50 h-full`}>
     <div className =" w-full flex items-end justify-center cursor-default">
          <h1 className="text-lg p-2 m-2 bg-background">Previous Chats</h1>
          </div> 
          <div className=" flex justify-between gap-3 mb-2 px-3 border-b-2 border-background py-2">
          <button 
            onClick={handleOnAdd}
            title="Create Chat"
            className=" w-1/2 shadow-sm shadow-background hover:shadow-background_third hover:border-background_third hover:bg-background border-2 border-background flex justify-center items-center ">
            <IoAdd 
                className="text-4xl text-white "
            />
          </button>
          <button 
          title="See your Profile"
            className=" shadow-sm shadow-background  hover:shadow-background_third w-1/2 hover:border-background_third hover:bg-background border-2 border-background flex justify-center items-center "
            onClick={() => router.push("/profile")}
            >
            <FaUserTie 
               className="text-2xl text-white  "
               
            />
          </button>
        </div>
     <div className="flex flex-col overflow-auto h-full pb-24 ">
     {loading ? (
          <LoadingDots />
        ) : (
          chats.length > 0 ? (
            chats.map((chat) => (
              <MenuItem key={chat.id} chat={chat} />
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <p>There are no chats</p>
            </div>
          )
        )}
        </div>

        {
          showAdd &&
          <Modal
            onClose={() => setShowAdd(false)}>
              <form 
              onSubmit={handleSubmitNewChat}
              className=" flex flex-col justify-center bg-background_secondary p-3 w-full border-2 border-background_third shadow-sm shadow-background_third" >
                <LabelInput 
                  type={"text"}
                  name={"title"}
                  placeholder={"ie. About wether"}
                  title={"Chat Title"}
                />
                <button className="w-full shadow-sm hover:scale-105 shadow-exalt-light p-2 hover:shadow-exalt_second-light mb-3 bg-exalt hover:bg-exalt_second transition-all duration-500" type="submit">create</button>
                {
                  submittingForm &&
                  <LoadingDots 
                    text={"creating"}
                  />
                }
              </form>
            </Modal>
        }
        

     </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
