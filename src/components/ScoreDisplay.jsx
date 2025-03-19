import React from 'react';

const ScoreDisplay = ({ score = 0 }) => {
  return (
    <div className="text-2xl font-bold text-white mb-4">
      Samosas Sliced: {score}
    </div>
  );
};

export default ScoreDisplay; 