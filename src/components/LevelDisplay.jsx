import React from 'react';
import { motion } from 'framer-motion';

const LevelDisplay = ({ level, targetScore }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-[400px] mb-4">
      <motion.div 
        className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg shadow"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        Level: {level}
      </motion.div>
      <motion.div 
        className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg shadow"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
      >
        Target: {targetScore}
      </motion.div>
    </div>
  );
};

export default LevelDisplay; 