import React from 'react';

const GameArea = ({ children }) => {
  return (
    <div className="w-[400px] h-[600px] rounded-lg shadow-lg mb-6 relative overflow-hidden">
      {/* Background color */}
      <div
        className="absolute inset-0 bg-amber-50 z-0"
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