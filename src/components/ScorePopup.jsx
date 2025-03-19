import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScorePopup = ({ position, value, type }) => {
  // Determine color based on samosa type
  let textColor = 'text-amber-600';
  if (type === 'spicy') textColor = 'text-red-600';
  else if (type === 'golden') textColor = 'text-yellow-400';
  else if (type === 'mega') textColor = 'text-purple-600';
  
  return (
    <AnimatePresence>
      <motion.div
        className={`absolute text-2xl font-bold ${textColor}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          textShadow: '0px 0px 2px white, 0px 0px 4px white'
        }}
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ opacity: 1, scale: 1.5, y: -40 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        +{value}
      </motion.div>
    </AnimatePresence>
  );
};

export default ScorePopup; 