import React from 'react';
import ifterBackdrop from '../assets/iftar-backdrop.png';

const GameArea = ({ children }) => {
  return (
    <div className="w-[400px] h-[600px] rounded-lg shadow-lg mb-6 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${ifterBackdrop})` }}
      ></div>
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gray-200 bg-opacity-60 z-10"></div>
      
      {/* Content container */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GameArea; 