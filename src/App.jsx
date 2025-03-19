import React, { useState, useEffect, useCallback } from 'react';
import ScoreDisplay from './components/ScoreDisplay';
import GameArea from './components/GameArea';
import StartButton from './components/StartButton';
import Samosa from './components/Samosa';
import Timer from './components/Timer';
import PowerUp from './components/PowerUp';
import GameOver from './components/GameOver';
import LevelDisplay from './components/LevelDisplay';
import ScorePopup from './components/ScorePopup';

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [samosas, setSamosas] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [targetScore, setTargetScore] = useState(10);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [scorePopups, setScorePopups] = useState([]);
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
    
    // Add a new samosa
    setTimeout(() => {
      if (gameStarted && !gameOver) {
        addSamosa();
      }
    }, 500);
  };

  // Handle power-up click
  const handlePowerUpClick = (id) => {
    const clickedPowerUp = powerUps.find(powerUp => powerUp.id === id);
    if (!clickedPowerUp) return;
    
    // Apply power-up effect based on type
    switch (clickedPowerUp.type) {
      case 'timePlus':
        setTimeLeft(prev => Math.min(prev + 15, 60));
        break;
      case 'pointsDouble':
        setScoreMultiplier(2);
        setTimeout(() => setScoreMultiplier(1), 10000); // 10 seconds of 2x points
        break;
      case 'clearAll':
        // Clear all samosas and add new ones with points
        setSamosas([]);
        setScore(prev => prev + samosas.length * 2);
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (gameStarted && !gameOver) addSamosa();
          }, i * 200);
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
    
    if (rand < 5 + level) {
      type = 'golden'; // Golden is rare
    } else if (rand < 15 + level * 2) {
      type = 'spicy'; // Spicy is uncommon
    } else if (rand < 5 + level / 2) {
      type = 'mega'; // Mega is very rare but more common at higher levels
    }
    
    const newSamosa = {
      id: Date.now(),
      position: generateRandomPosition(),
      type
    };
    setSamosas(prev => [...prev, newSamosa]);
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
    
    // Power-up disappears after 8 seconds if not clicked
    setTimeout(() => {
      setPowerUps(prev => prev.filter(powerUp => powerUp.id !== newPowerUp.id));
    }, 8000);
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
        if (Math.random() < 0.15 + level * 0.02) {
          addPowerUp();
        }
      }, 10000); // Check for spawning every 10 seconds
    }
    
    return () => clearInterval(powerUpTimer);
  }, [gameStarted, level, addPowerUp, gameOver]);

  // Check for level up
  useEffect(() => {
    if (score >= targetScore && gameStarted) {
      setLevel(prev => prev + 1);
      setTargetScore(prev => prev + 10 + level * 5);
      setTimeLeft(prev => Math.min(prev + 15, 60)); // Bonus time for level up
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
    setTimeLeft(60);
    setLevel(1);
    setTargetScore(10);
    setScoreMultiplier(1);
    setSamosas([]);
    setPowerUps([]);
    setScorePopups([]);
    
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
        {gameStarted && samosas.map(samosa => (
          <Samosa 
            key={samosa.id}
            position={samosa.position}
            type={samosa.type}
            onClick={() => handleSamosaClick(samosa.id)}
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
        
        {gameOver && (
          <GameOver 
            score={score} 
            highScore={highScore} 
            onRestart={handleStartGame} 
          />
        )}
      </GameArea>
      
      {!gameStarted && !gameOver && <StartButton onClick={handleStartGame} />}
      
      {scoreMultiplier > 1 && gameStarted && (
        <div className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
          2x Points Active!
        </div>
      )}
    </div>
  );
}

export default App;