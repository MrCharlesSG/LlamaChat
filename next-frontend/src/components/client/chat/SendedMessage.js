import React from 'react'
import { TfiAngleLeft } from "react-icons/tfi";

function SendedMessage({message}) {
  return (
    <div className="flex flex-row pl-10 justify-end">
        <div className="  bg-background_secondary p-5 pr-10 flex items-start relative">
          <TfiAngleLeft
            size={20}
            className="absolute right-3 top-5 text-exalt_second"
          />
          <p className="text-sm">{message}</p>
        </div>
      </div>
  )
}

export default SendedMessage