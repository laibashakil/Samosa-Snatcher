import React from 'react';

const Timer = ({ timeLeft, isActive }) => {
  // Calculate percentage for progress bar
  const percentage = (timeLeft / 60) * 100;
  
  // Determine color based on time left
  let colorClass = 'bg-green-500';
  if (timeLeft <= 20) colorClass = 'bg-red-500';
  else if (timeLeft <= 30) colorClass = 'bg-yellow-500';
  
  return (
    <div className="w-full max-w-[400px] mb-4">
      <div className="flex justify-between text-white mb-1">
        <span className="font-bold">Time:</span>
        <span className="font-bold">{timeLeft} seconds</span>
      </div>
      <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer; 