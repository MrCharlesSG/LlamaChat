import React from 'react';
import Image from "next/image";
import { StartStats } from '@/components/server/ui/StartStats';
import PricingSection from '@/components/server/start/PricingSection';

function HomePage() {
  return (
    <div className="w-full">
      {/* Texto principal con la imagen de fondo */}
      <div className="relative w-full h-[600px]">
        <Image
          src={"/images/background-ai.jpg"}
          fill
          alt="Digital brain"
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start md:ml-32 ml-5 z-10 text-center md:text-left">
          <p className="items-center">
            <span className="text-white text-4xl sm:text-5xl lg:text-[60px] 2xl:text-[80px]">
              Meet
            </span>
            <span className="text-exalt_second ml-3 sm:ml-5 font-bold text-5xl sm:text-6xl lg:text-[80px] 2xl:text-[120px]">
              LlamaChat
            </span>
          </p>
          <p className="flex flex-col sm:flex-row leading-8 sm:leading-10 mt-3 sm:mt-5">
            <span className="text-white text-3xl sm:text-4xl lg:text-[60px]">
              The chatbot with real-time data
            </span>
            <span className="text-exalt sm:ml-5 font-bold text-4xl sm:text-5xl lg:text-[80px] 2xl:text-[120px]">
              for smarter decisions
            </span>
          </p>
        </div>
      </div>

      {/* Fondo degradado en StartStats */}
      <div className="w-full h-auto bg-gradient-to-b from-[#051127] to-background">
        <StartStats />
      </div>

      {/* About Us */}
      <div id="about-us" className="w-full p-10 mt-14">
        <h2 className="text-4xl sm:text-[60px] font-bold text-center text-exalt_main">
          About Us
        </h2>
        <p className="mt-5 text-xl sm:text-[24px] text-center">
          LlamaChat is powered by the advanced Llama 3.1 AI engine, giving businesses access to real-time information like weather updates and currency exchange rates. Designed for modern enterprises, LlamaChat can help automate customer interactions, provide instant insights, and streamline decision-making with up-to-the-minute data from the web.
        </p>
      </div>

      {/* Galería sobre llamas */}
      <div id="llama-inspiration" className="w-full p-10 space-y-10">
        {/* Primera línea */}
        <div className="flex flex-col gap-5 md:flex-row items-center  justify-between space-y-5 md:space-y-0 md:space-x-5">
          <div className="md:w-1/2">
            <h3 className="text-exalt_second text-center md:text-start text-3xl sm:text-[40px] font-bold text-exalt_main">
              Why Llamas Inspire Us
            </h3>
            <p className="mt-5 text-exalt_second-light text-center md:text-start text-lg sm:text-xl">
              Llamas are known for their adaptability, resilience, and strength in challenging environments. Just like llamas, LlamaChat is built to adapt to the needs of businesses, providing reliable, flexible, and efficient support regardless of the circumstances.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={"/images/llama-machu-picchu-lama.jpg"}
              width={600}
              height={400}
              alt="Llama standing tall"
              className="object-cover"
            />
          </div>
        </div>

        {/* Segunda línea */}
        <div className="flex flex-col gap-5 md:flex-row-reverse items-center justify-between space-y-5 md:space-y-0 md:space-x-5">
          <div className="md:w-1/2">
            <h3 className="text-3xl text-exalt  sm:text-[40px] text-center md:text-start font-bold text-exalt_main">
              A Symbol of Strength
            </h3>
            <p className="mt-5 text-exalt-light text-lg text-center md:text-start sm:text-xl">
              Llamas are symbols of hard work and reliability. They carry heavy loads and remain steady under pressure. At LlamaChat, we embody these qualities by ensuring that our AI provides stable and dependable service no matter the demand.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={"/images/llamas_tied_together.jpg"}
              width={600}
              height={400}
              alt="Llama walking through mountains"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <PricingSection />
    </div>
  );
}

export default HomePage;
