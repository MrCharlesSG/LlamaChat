"use client";
import React, { useState } from "react";
import MenuBarMobile from "./MenuBarMobile.js";
import Sidebar from "./SideBar";
import { FiSave } from "react-icons/fi";

export default function avigationClient() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <MenuBarMobile setter={setShowSidebar} />
      <Sidebar show={showSidebar} setter={setShowSidebar} />
      
    </>
  );
}
