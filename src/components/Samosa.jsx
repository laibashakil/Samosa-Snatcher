import React from 'react';
import { motion } from 'framer-motion';

const Samosa = ({ position, onClick, type = 'regular', scale = 1 }) => {
  // Different samosa colors and styles based on type
  const samosaStyles = {
    regular: {
      outer: 'border-b-amber-600',
      inner: 'bg-amber-500'
    },
    spicy: {
      outer: 'border-b-red-600',
      inner: 'bg-red-500'
    },
    golden: {
      outer: 'border-b-yellow-400',
      inner: 'bg-yellow-300'
    },
    mega: {
      outer: 'border-b-purple-600',
      inner: 'bg-purple-500'
    }
  };

  const styles = samosaStyles[type] || samosaStyles.regular;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `scale(${scale})`
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        rotate: type === 'golden' ? [0, 360] : 0 
      }}
      transition={{ 
        duration: type === 'golden' ? 2 : 0.3,
        repeat: type === 'golden' ? Infinity : 0
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <div className={`w-20 h-16 relative ${type === 'mega' ? 'scale-125' : ''}`}>
        <div className={`absolute top-0 left-0 w-0 h-0 
          border-l-[40px] border-r-[40px] border-b-[80px] 
          border-l-transparent border-r-transparent ${styles.outer}
          rotate-180`} 
        />
        <div className={`absolute top-2 left-4 w-12 h-12 ${styles.inner} rounded-tl-xl rounded-br-xl`} />
      </div>
    </motion.div>
  );
};

export default Samosa; 