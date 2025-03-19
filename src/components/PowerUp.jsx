import React from 'react';
import { motion } from 'framer-motion';

const PowerUp = ({ position, type, onClick }) => {
  // Different power-up styles
  const powerUpStyles = {
    timePlus: {
      icon: '⏱️',
      className: 'bg-blue-500'
    },
    pointsDouble: {
      icon: '2️⃣',
      className: 'bg-purple-500'
    },
    clearAll: {
      icon: '💥',
      className: 'bg-red-500'
    }
  };

  const style = powerUpStyles[type] || powerUpStyles.timePlus;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [1, 1.2, 1], 
        opacity: 1,
        y: [0, -10, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-full ${style.className} flex items-center justify-center shadow-lg text-xl`}>
        {style.icon}
      </div>
    </motion.div>
  );
};

export default PowerUp; 