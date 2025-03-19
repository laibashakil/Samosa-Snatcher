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
  const [timeLeft, setTimeLeft] = useState(30);
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
      case 'mega': points = 10; break;
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
    
    // Calculate penalty (more severe in higher levels and increased base penalty)
    const penalty = Math.min(8 + Math.floor(level / 2), 20); // Increased penalty
    
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
    
    // Penalty: reduce time (increased time penalty)
    setTimeLeft(prev => Math.max(prev - 3, 1)); // Increased from 2 to 3 seconds
    
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
        setTimeLeft(prev => Math.min(prev + 10, 30)); // Reduced time bonus from 15 to 10
        break;
      case 'pointsDouble':
        setScoreMultiplier(2);
        setTimeout(() => setScoreMultiplier(1), 8000); // Reduced from 10000ms to 8000ms
        break;
      case 'clearAll':
        // Clear all samosas and add new ones with points
        setSamosas([]);
        setScore(prev => prev + samosas.length * 2);
        
        // Also clear burned samosas and warnings as a bonus
        setBurnedSamosas([]);
        setWarningIndicators([]);
        
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (gameStarted && !gameOver) addSamosa();
          }, i * 150); // Reduced from 200ms
        }
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
    } else if (rand < 3 + level * 0.4) {
      type = 'mega'; // Mega is very rare but more common at higher levels
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
    
    // Create and show warning
    const warningId = Date.now();
    setWarningIndicators(prev => [...prev, {
      id: warningId,
      position
    }]);
    
    // After warning animation, add the burned samosa at the same position
    // Reduced warning time to make game harder
    setTimeout(() => {
      // Remove warning
      setWarningIndicators(prev => prev.filter(warning => warning.id !== warningId));
      
      // Add burned samosa if game is still active
      if (gameStarted && !gameOver) {
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
      }
    }, 1000); // Reduced from 1500ms to 1000ms
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
    
    // Power-up disappears after shorter time if not clicked
    setTimeout(() => {
      setPowerUps(prev => prev.filter(powerUp => powerUp.id !== newPowerUp.id));
    }, 6000); // Reduced from 8000ms
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
        // Made power-ups slightly less common
        if (Math.random() < 0.12 + level * 0.015) {
          addPowerUp();
        }
      }, 12000); // Increased from 10000ms to reduce power-up frequency
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
      setTimeLeft(prev => Math.min(prev + 8, 30)); // Reduced from 15 to 8 seconds
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
    setTimeLeft(30); // Reduced from 60 to 30 seconds
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
    <div className="min-h-screen w-full bg-blue-600 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Samosa Stack Slicer</h1>
      
      {gameStarted && (
        <>
          <ScoreDisplay score={score} />
          <Timer timeLeft={timeLeft} isActive={gameStarted} />
          <LevelDisplay level={level} targetScore={targetScore} />
        </>
      )}
      
      <GameArea>
        {gameStarted && warningIndicators.map(warning => (
          <WarningIndicator
            key={warning.id}
            position={warning.position}
          />
        ))}
        
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
      
      {!gameStarted && !gameOver && <StartButton onClick={handleStartGame} />}
      
      {level === 1 && gameStarted && (
        <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
          Warning: This game is challenging! Avoid the burned samosas!
        </div>
      )}
      
      {scoreMultiplier > 1 && gameStarted && (
        <div className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
          2x Points Active!
        </div>
      )}
    </div>
  );
}

export default App;