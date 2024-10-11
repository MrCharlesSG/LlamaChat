
import Link from "next/link";
import React from "react";
import ChatView from "@/components/server/chat/ChatView";

function Chat() {
  return (
    <div className="  md:pl-64 w-full h-full bg-background ">
      
      <div className=" w-full h-full bg-background  flex items-center flex-col">
      <ChatView />
      </div>
    </div>
  );
}

export default Chat;
