import React from 'react';
import { motion } from 'framer-motion';

const GameOver = ({ score, highScore, onRestart }) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-black bg-opacity-70 z-30 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-5/6 max-w-sm"
        initial={{ scale: 0.5, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
        
        <div className="mb-6 w-full">
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Your Score: <span className="text-blue-600">{score}</span>
          </p>
          <p className="text-xl font-semibold text-gray-800">
            High Score: <span className="text-green-600">{highScore}</span>
          </p>
        </div>
        
        {score >= highScore && score > 0 && (
          <motion.div 
            className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-6 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            <p className="text-lg font-bold text-yellow-700">New High Score! 🎉</p>
          </motion.div>
        )}
        
        <button
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transition-colors duration-200"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOver; 