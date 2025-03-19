import React from 'react';
import { motion } from 'framer-motion';

const WarningIndicator = ({ position }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 5,
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [1, 0.3, 1, 0.3, 1],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: 0
      }}
    >
      <div className="w-24 h-24 rounded-full border-2 border-red-600 flex items-center justify-center">
        <motion.div 
          className="w-20 h-20 rounded-full bg-red-600 bg-opacity-30 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <span className="text-2xl">⚠️</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WarningIndicator; 