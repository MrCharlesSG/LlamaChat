import React from 'react';
import './LoadingDots.css'; // Creamos el archivo de estilos por separado

const LoadingDots = ({text}) => {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <p>{text?text:"Loading"}</p>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default LoadingDots;
