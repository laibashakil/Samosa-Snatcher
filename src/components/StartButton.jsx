import React from 'react';

const StartButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transition-colors duration-200"
    >
      Start Slicing!
    </button>
  );
};

export default StartButton; 