"use client";
import React, { useState, useEffect } from "react";
import MenuBarMobile from "./MenuBarMobile.js";
import Sidebar from "./SideBar";

export default function StartNavigationClient() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPastAboutUs, setIsPastAboutUs] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutUsSection = document.getElementById('about-us');
      if (aboutUsSection) {
        const sectionTop = aboutUsSection.getBoundingClientRect().top;
        const isPast = sectionTop <= 60; 
        setIsPastAboutUs(isPast);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <MenuBarMobile setter={setShowSidebar} isPastAboutUs={isPastAboutUs} />
      <Sidebar show={showSidebar} setter={setShowSidebar} />
    </>
  );
}

