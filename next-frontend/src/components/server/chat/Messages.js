"use client"
import MessageCard from "@/components/client/chat/MessageCard";

function Messages({messages}) {
  

  return (
    <div className=" w-full pb-10">
      {
        messages.map((message, index) => (
          <MessageCard message={message} key={index} />
        ))
      }
    </div>
  );
}

export default Messages;
