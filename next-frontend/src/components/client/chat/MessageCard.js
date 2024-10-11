import React from "react";
import { TfiAngleRight } from "react-icons/tfi";
import SendedMessage from "./SendedMessage";

function MessageCard({ message }) {
  return (
    <div className=" flex flex-col space-y-2 my-6 mr-6">
      {/* Mensaje */}
      <SendedMessage 
        message={message.message}
      />

      <div className="flex flex-row pr-10 justify-start">
        <div className=" bg-transparent p-5 pl-10 flex items-start relative">
          <TfiAngleRight
            size={20}
            className="absolute left-3 top-5 text-exalt"
          />
          <p className="text-sm">{message.response}</p>
        </div>
      </div>
      <hr className=" border-background_secondary"/>
    </div>
  );
}

export default MessageCard;
