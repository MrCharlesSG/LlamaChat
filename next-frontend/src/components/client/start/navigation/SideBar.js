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
import Logo from "@/components/server/ui/Logo";
import { NAVIGATION_ITEMS } from "@/utils/navigation-start";
import { usePathname } from 'next/navigation';




export default function Sidebar({ show, setter }) {
 



  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  const MenuItem = ({ navigationItem }) => {
    const pathname = usePathname(); // Obtiene la ruta actual
  
    console.log("The path "+ pathname)
    // Compara la ruta actual con el link del ítem de navegación
    const isActive = false;
  
    return (
      <Link 
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
        href={navigationItem.link}
        className={`border-b-background flex p-2 flex-col items-center border-2 mb-1
        border-background_secondary bg-transparent hover:bg-background hover:border-background_third 
        ${isActive ? 'text-exalt font-bold' : ''}`} // Aplica clase condicional si la URL coincide
      >
        <p className={`overflow-hidden text-ellipsis whitespace-nowrap`}
          style={{ maxWidth: '100%' }}>
          {navigationItem.title}
        </p>
      </Link>
    );
  };
  


  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  );

  

  return (
    <>
     <div className={` ${appendClass} md:hidden flex flex-col justify-center p-4 bg-background_secondary w-[250px] pb-10 transition-[margin-left] ease-in-out duration-500 fixed md:fixed left-0 top-0 z-50 h-full`}>
     
         <Logo />
         <div className="flex-1 py-5">
         {
          NAVIGATION_ITEMS.map((nav, index) => (
              <MenuItem key={index} navigationItem={nav} />
            ))
         }
         </div>
         <Link
          href="/chat"
          className=" text-center bg-exalt text-background_secondary p-2 border-2 border-exalt-light shadow-sm shadow-exalt-light hover:bg-exalt_second hover:border-exalt_second-light transition-colors duration-300 hover:shadow-exalt_second-light"
        >
          Try Chat
        </Link>
        

     </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
