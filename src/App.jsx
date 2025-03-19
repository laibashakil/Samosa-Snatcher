import React, { useState, useEffect, useCallback } from 'react';
import ScoreDisplay from './components/ScoreDisplay';
import GameArea from './components/GameArea';
import StartButton from './components/StartButton';
import Samosa from './components/Samosa';
import BurnedSamosa from './components/BurnedSamosa';
import Timer from './components/Timer';
import PowerUp from './components/PowerUp';
import GameOver from './components/GameOver';
import LevelDisplay from './components/LevelDisplay';
import ScorePopup from './components/ScorePopup';
import NegativeScorePopup from './components/NegativeScorePopup';
import WarningIndicator from './components/WarningIndicator';

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [samosas, setSamosas] = useState([]);
  const [burnedSamosas, setBurnedSamosas] = useState([]);
  const [warningIndicators, setWarningIndicators] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [level, setLevel] = useState(1);
  const [targetScore, setTargetScore] = useState(10);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [scorePopups, setScorePopups] = useState([]);
  const [negativeScorePopups, setNegativeScorePopups] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Generate random position within game area bounds
  const generateRandomPosition = () => {
    return {
      x: Math.random() * 320 + 20, // Keep within game area with padding
      y: Math.random() * 520 + 20
    };
  };

  // Handle samosa click (slicing)
  const handleSamosaClick = (id) => {
    // Find the samosa to get position and type for score popup
    const clickedSamosa = samosas.find(samosa => samosa.id === id);
    if (!clickedSamosa) return;

    // Calculate points based on samosa type
    let points = 1;
    switch (clickedSamosa.type) {
      case 'spicy': points = 2; break;
      case 'golden': points = 5; break;
      default: points = 1;
    }
    
    // Apply score multiplier
    points *= scoreMultiplier;
    
    // Create score popup
    const newPopup = {
      id: Date.now(),
      position: clickedSamosa.position,
      value: points,
      type: clickedSamosa.type
    };
    
    setScorePopups(prev => [...prev, newPopup]);
    
    // Remove popup after animation
    setTimeout(() => {
      setScorePopups(prev => prev.filter(popup => popup.id !== newPopup.id));
    }, 1000);
    
    // Remove the clicked samosa
    setSamosas(prev => prev.filter(samosa => samosa.id !== id));
    
    // Increase score
    setScore(prev => prev + points);
    
    // Add a new samosa with shorter delay to increase difficulty
    setTimeout(() => {
      if (gameStarted && !gameOver) {
        addSamosa();
      }
    }, 300); // Reduced from 500ms
  };

  // Handle burned samosa click (penalty)
  const handleBurnedSamosaClick = (id) => {
    // Find the burned samosa
    const clickedBurnedSamosa = burnedSamosas.find(samosa => samosa.id === id);
    if (!clickedBurnedSamosa) return;
    
    // Fixed penalty of 10 points
    const penalty = 10;
    
    // Create negative score popup
    const newPopup = {
      id: Date.now(),
      position: clickedBurnedSamosa.position,
      value: `-${penalty}`
    };
    
    setNegativeScorePopups(prev => [...prev, newPopup]);
    
    // Remove popup after animation
    setTimeout(() => {
      setNegativeScorePopups(prev => prev.filter(popup => popup.id !== newPopup.id));
    }, 1000);
    
    // Remove the clicked burned samosa
    setBurnedSamosas(prev => prev.filter(samosa => samosa.id !== id));
    
    // Decrease score (but not below 0)
    setScore(prev => Math.max(prev - penalty, 0));
    
    // Add a new burned samosa with delay
    setTimeout(() => {
      if (gameStarted && !gameOver) {
        showWarningAndAddBurnedSamosa();
      }
    }, 800); // Reduced from 1000ms
  };

  // Handle power-up click
  const handlePowerUpClick = (id) => {
    const clickedPowerUp = powerUps.find(powerUp => powerUp.id === id);
    if (!clickedPowerUp) return;
    
    // Apply power-up effect based on type
    switch (clickedPowerUp.type) {
      case 'timePlus':
        setTimeLeft(prev => Math.min(prev + 10, 20)); // Cap at 20 seconds
        break;
      case 'pointsDouble':
        setScoreMultiplier(2);
        setTimeout(() => setScoreMultiplier(1), 8000); // Reduced from 10000ms to 8000ms
        break;
      case 'clearAll':
        // Trigger game over
        handleGameOver();
        break;
      default:
        break;
    }
    
    // Remove the clicked power-up
    setPowerUps(prev => prev.filter(powerUp => powerUp.id !== id));
  };

  // Add a new samosa to the game area
  const addSamosa = () => {
    // Determine type based on probability (affected by level)
    let type = 'regular';
    const rand = Math.random() * 100;
    
    // Adjusted probabilities to make special samosas slightly less common
    if (rand < 4 + level * 0.8) {
      type = 'golden'; // Golden is rare
    } else if (rand < 12 + level * 1.5) {
      type = 'spicy'; // Spicy is uncommon
    }
    
    const newSamosa = {
      id: Date.now(),
      position: generateRandomPosition(),
      type
    };
    setSamosas(prev => [...prev, newSamosa]);
  };

  // Add a warning indicator then a burned samosa
  const showWarningAndAddBurnedSamosa = () => {
    if (!gameStarted || gameOver) return;
    
    const position = generateRandomPosition();
    
    // Immediately add burned samosa without warning
    const newBurnedSamosa = {
      id: Date.now(),
      position
    };
    setBurnedSamosas(prev => [...prev, newBurnedSamosa]);
    
    // Auto-remove after some time if not clicked (harder in higher levels)
    // Further reduced time to remove, making them disappear faster
    const timeToRemove = Math.max(6000 - level * 500, 2000); // Reduced from 8000/3000 to 6000/2000
    setTimeout(() => {
      if (gameStarted && !gameOver) {
        setBurnedSamosas(prev => prev.filter(s => s.id !== newBurnedSamosa.id));
      }
    }, timeToRemove);
  };

  // Add a power-up
  const addPowerUp = useCallback(() => {
    if (!gameStarted || gameOver) return;
    
    // Random power-up type
    const types = ['timePlus', 'pointsDouble', 'clearAll'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const newPowerUp = {
      id: Date.now(),
      position: generateRandomPosition(),
      type
    };
    
    setPowerUps(prev => [...prev, newPowerUp]);
    
    // Power-up disappears after time if not clicked
    setTimeout(() => {
      setPowerUps(prev => prev.filter(powerUp => powerUp.id !== newPowerUp.id));
    }, 8000); // Increased from 6000ms to give players more time
  }, [gameStarted, gameOver]);

  // Game timer
  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      handleGameOver();
    }
    
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameOver]);

  // Power-up spawner
  useEffect(() => {
    let powerUpTimer;
    if (gameStarted && !gameOver) {
      powerUpTimer = setInterval(() => {
        // Spawn power-up based on random chance and level
        // Increased power-up frequency
        if (Math.random() < 0.25 + level * 0.03) {
          // Sometimes spawn multiple power-ups at once
          const powerUpCount = Math.random() < 0.3 ? 2 : 1;
          for (let i = 0; i < powerUpCount; i++) {
            setTimeout(() => {
              if (gameStarted && !gameOver) addPowerUp();
            }, i * 300);
          }
        }
      }, 6000); // Reduced from 12000ms to increase power-up frequency
    }
    
    return () => clearInterval(powerUpTimer);
  }, [gameStarted, level, addPowerUp, gameOver]);

  // Burned samosa spawner - increased frequency significantly
  useEffect(() => {
    let burnedSamosaTimer;
    // Start showing burned samosas from level 1 now
    if (gameStarted && !gameOver) {
      burnedSamosaTimer = setInterval(() => {
        // Spawn burned samosa with significantly increased frequency by level
        if (Math.random() < 0.25 + level * 0.05) { // Increased from 0.1 + level * 0.03
          showWarningAndAddBurnedSamosa();
        }
      }, 3000); // Reduced from 5000ms to 3000ms
    }
    
    return () => clearInterval(burnedSamosaTimer);
  }, [gameStarted, level, gameOver]);

  // Check for level up
  useEffect(() => {
    if (score >= targetScore && gameStarted) {
      setLevel(prev => prev + 1);
      setTargetScore(prev => prev + 10 + level * 5);
      // Reduced time bonus for level up
      setTimeLeft(prev => Math.min(prev + 8, 20)); // Cap at 20 seconds
    }
  }, [score, targetScore, gameStarted, level]);

  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Start the game
  const handleStartGame = () => {
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(20); // Reduced from 30 to 20 seconds
    setLevel(1);
    setTargetScore(10);
    setScoreMultiplier(1);
    setSamosas([]);
    setBurnedSamosas([]);
    setWarningIndicators([]);
    setPowerUps([]);
    setScorePopups([]);
    setNegativeScorePopups([]);
    
    // Add initial samosas
    const initialSamosas = [];
    for (let i = 0; i < 5; i++) {
      initialSamosas.push({
        id: Date.now() + i,
        position: generateRandomPosition(),
        type: 'regular'
      });
    }
    setSamosas(initialSamosas);
    
    // Add first burned samosa after short delay to increase challenge immediately
    setTimeout(() => {
      if (gameStarted) {
        showWarningAndAddBurnedSamosa();
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4" 
         style={{
           backgroundImage: `radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4) 1px, transparent 1px), 
                             radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.2) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                             radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
           backgroundSize: '20px 20px, 35px 35px, 50px 50px, 100px 100px, 75px 75px'
         }}>
      
      <div className="mb-10 relative">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-200 relative" 
            style={{
              fontFamily: "'Rajdhani', 'Electrolize', sans-serif",
              letterSpacing: "0.15em",
              textShadow: "0 0 2px rgba(255,255,255,0.5), 0 0 15px rgba(111, 76, 255, 0.5)"
            }}>
          <span className="relative inline-block">
            <span className="opacity-30 absolute top-0 left-1 text-purple-800">SAMOSA</span>
            <span className="relative z-10">SAMOSA</span>
          </span>
          <span className="mx-1"></span>
          <span className="relative inline-block text-cyan-100">
            <span className="opacity-30 absolute top-0 left-1 text-cyan-800">SNATCHER</span>
            <span className="relative z-10">SNATCHER</span>
          </span>
        </h1>
        
        <div className="h-1.5 w-full mt-3 rounded-sm overflow-hidden shadow-lg">
          <div 
            className="h-full w-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600" 
            style={{
              animation: "gradientShift 2s linear infinite",
              backgroundSize: "200% 100%"
            }}
          ></div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes gradientShift {
              0% { background-position: 0% 0; }
              100% { background-position: 200% 0; }
            }
          `
        }} />
      </div>
      
      {gameStarted && (
        <>
          <ScoreDisplay score={score} />
          <Timer timeLeft={timeLeft} isActive={gameStarted} />
          <LevelDisplay level={level} targetScore={targetScore} />
        </>
      )}
      
      <GameArea>
        {!gameStarted && !gameOver && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="bg-gray-800 bg-opacity-70 px-8 py-5 rounded max-w-2xl text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <h2 className="text-xl font-bold text-purple-300 mb-4 text-center tracking-wider">HOW TO PLAY</h2>
              <div className="flex justify-center gap-5 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center">
                    <div className="w-10 h-8 relative">
                      <div className="absolute top-0 left-0 w-0 h-0 
                        border-l-[20px] border-r-[20px] border-b-[40px] 
                        border-l-transparent border-r-transparent border-b-amber-600
                        rotate-180" 
                      />
                      <div className="absolute top-1 left-2 w-6 h-6 bg-amber-500 rounded-tl-xl rounded-br-xl" />
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium">Regular</span>
                  <span className="text-green-400 text-xs">+1 pt</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center">
                    <div className="w-10 h-8 relative">
                      <div className="absolute top-0 left-0 w-0 h-0 
                        border-l-[20px] border-r-[20px] border-b-[40px] 
                        border-l-transparent border-r-transparent border-b-red-600
                        rotate-180" 
                      />
                      <div className="absolute top-1 left-2 w-6 h-6 bg-red-500 rounded-tl-xl rounded-br-xl" />
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium">Spicy</span>
                  <span className="text-green-400 text-xs">+2 pts</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center">
                    <div className="w-10 h-8 relative">
                      <div className="absolute top-0 left-0 w-0 h-0 
                        border-l-[20px] border-r-[20px] border-b-[40px] 
                        border-l-transparent border-r-transparent border-b-yellow-400
                        rotate-180" 
                      />
                      <div className="absolute top-1 left-2 w-6 h-6 bg-yellow-300 rounded-tl-xl rounded-br-xl" />
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium">Golden</span>
                  <span className="text-green-400 text-xs">+5 pts</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center">
                    <div className="w-10 h-8 relative">
                      <div className="absolute top-0 left-0 w-0 h-0 
                        border-l-[20px] border-r-[20px] border-b-[40px] 
                        border-l-transparent border-r-transparent border-b-gray-800
                        rotate-180" 
                      />
                      <div className="absolute top-1 left-2 w-6 h-6 bg-gray-900 rounded-tl-xl rounded-br-xl"></div>
                    </div>
                  </div>
                  <span className="text-white text-xs font-medium">Burned</span>
                  <span className="text-red-400 text-xs">-10 pts</span>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center bg-blue-500 rounded-full text-xl">
                    ⏱️
                  </div>
                  <span className="text-white text-xs font-medium">Time Bonus</span>
                  <span className="text-blue-400 text-xs">+10 sec</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center bg-purple-500 rounded-full text-xl">
                    2️⃣
                  </div>
                  <span className="text-white text-xs font-medium">Multiplier</span>
                  <span className="text-purple-400 text-xs">2× pts for 8s</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mb-1 flex items-center justify-center bg-red-500 rounded-full text-xl">
                    💥
                  </div>
                  <span className="text-white text-xs font-medium">Bomb</span>
                  <span className="text-red-400 text-xs">Game Over!</span>
                </div>
              </div>
              
              <p className="text-white text-xs mt-4 px-2">Snatch samosas for points! Avoid burned ones. Use powerups to help.</p>
              
              <div className="mt-5">
                <StartButton onClick={handleStartGame} />
              </div>
            </div>
          </div>
        )}
        
        {gameStarted && warningIndicators.map(warning => (
          <WarningIndicator
            key={warning.id}
            position={warning.position}
          />
        ))}
        
        {/* Score multiplier notification */}
        {scoreMultiplier > 1 && gameStarted && (
          <div className="absolute top-2 right-2 bg-purple-900 bg-opacity-70 text-white px-3 py-1 rounded-sm text-sm font-medium flex items-center border-l-2 border-r-2 border-purple-400 z-50 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">2×</span>
          </div>
        )}
        
        {gameStarted && samosas.map(samosa => (
          <Samosa 
            key={samosa.id}
            position={samosa.position}
            type={samosa.type}
            onClick={() => handleSamosaClick(samosa.id)}
          />
        ))}
        
        {gameStarted && burnedSamosas.map(samosa => (
          <BurnedSamosa
            key={samosa.id}
            position={samosa.position}
            onClick={() => handleBurnedSamosaClick(samosa.id)}
          />
        ))}
        
        {gameStarted && powerUps.map(powerUp => (
          <PowerUp
            key={powerUp.id}
            position={powerUp.position}
            type={powerUp.type}
            onClick={() => handlePowerUpClick(powerUp.id)}
          />
        ))}

        {scorePopups.map(popup => (
          <ScorePopup
            key={popup.id}
            position={popup.position}
            value={popup.value}
            type={popup.type}
          />
        ))}
        
        {negativeScorePopups.map(popup => (
          <NegativeScorePopup
            key={popup.id}
            position={popup.position}
            value={popup.value}
          />
        ))}
        
        {gameOver && (
          <GameOver 
            score={score} 
            highScore={highScore} 
            onRestart={handleStartGame} 
          />
        )}
      </GameArea>
      
      {!gameStarted && !gameOver && (
        <div className="absolute opacity-0 pointer-events-none">
          <StartButton onClick={handleStartGame} />
        </div>
      )}
    </div>
  );
}

export default App;