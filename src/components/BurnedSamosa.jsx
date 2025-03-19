import React from 'react';
import { motion } from 'framer-motion';

const BurnedSamosa = ({ position, onClick }) => {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: 1,
        rotate: [0, 10, -10, 0]
      }}
      transition={{ 
        duration: 0.5,
        rotate: {
          repeat: Infinity,
          duration: 1.5
        }
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <div className="w-20 h-16 relative">
        <div className="absolute top-0 left-0 w-0 h-0 
          border-l-[40px] border-r-[40px] border-b-[80px] 
          border-l-transparent border-r-transparent border-b-gray-800
          rotate-180" 
        />
        <div className="absolute top-2 left-4 w-12 h-12 bg-gray-900 rounded-tl-xl rounded-br-xl">
          {/* Smoke effect */}
          <div className="absolute -top-4 left-2 w-2 h-2 bg-gray-300 rounded-full opacity-70 animate-ping"></div>
          <div className="absolute -top-3 left-5 w-2 h-2 bg-gray-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -top-5 left-8 w-2 h-2 bg-gray-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default BurnedSamosa; 