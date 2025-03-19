import React from 'react';

const StartButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-sm text-xl shadow-lg transition-colors duration-200 tracking-wider border-l-2 border-r-2 border-purple-400"
    >
      SNATCH!
    </button>
  );
};

export default StartButton; 