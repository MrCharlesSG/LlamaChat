import React from 'react';
import Image from 'next/image';

function Logo() {
  return (
    <div className="flex flex-row items-center justify-center w-full ">
      <div>
      <Image 
        src="/images/lllamaNoMod.png"
        width={40}
        height={40}
        alt="Llama Logo"
      />
      </div>
      <h1 className=" cursor-default text-center mt-2 text-2xl">CHAT</h1>
    </div>
  );
}

export default Logo;
