import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NegativeScorePopup = ({ position, value }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute text-2xl font-bold text-red-600"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          textShadow: '0px 0px 2px white, 0px 0px 4px white'
        }}
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1.5, 
          y: -40,
          rotate: [-5, 5, -5, 5, 0]
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
      >
        {value}
      </motion.div>
    </AnimatePresence>
  );
};

export default NegativeScorePopup; 