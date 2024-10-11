import React from 'react';

function Modal({ children, onClose }) {
  const handleBackgroundClick = (event) => {
    // Llama a onClose solo si se hace clic en el fondo
    if(onClose){
        onClose();
    }
  };

  return (
    <div 
      className="fixed w-full h-full top-0 left-0 bg-background_secondary bg-opacity-70 flex justify-center items-center z-20"
      onClick={handleBackgroundClick} 
    >
      <div 
        className="" 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
