

import React, { useState, useEffect, useCallback } from 'react';
import GameContainer from '../components/GameContainer';
import type { GameComponentProps } from '../types';

type GameState = 'start' | 'showing' | 'waiting' | 'finished';

const NumberSequence: React.FC<GameComponentProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateNewSequence = useCallback(() => {
    const newSequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserInput('');
    setCurrentIndex(0);
    setGameState('showing');
  }, [level]);
  
  const startGame = () => {
    setLevel(1);
    generateNewSequence();
  };

  useEffect(() => {
    if (gameState !== 'showing') return;

    if (currentIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setGameState('waiting');
    }
  }, [gameState, currentIndex, sequence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctSequence = sequence.join('');
    if (userInput === correctSequence) {
      setLevel(prev => prev + 1);
      // Small delay before next level starts
      setTimeout(generateNewSequence, 500);
    } else {
      setGameState('finished');
    }
  };
  
  const renderContent = () => {
    if (gameState === 'start' || gameState === 'finished') {
        return (
            <div className="text-center">
                {gameState === 'finished' && (
                    <>
                        <h3 className="text-5xl font-bold text-red-400 mb-2">Game Over</h3>
                        <p className="text-2xl mb-6">You reached <span className="font-bold text-white">Level {level}</span></p>
                         <p className="text-lg mb-4 text-gray-400">Correct sequence was: {sequence.join('')}</p>
                    </>
                )}
                <button
                  onClick={startGame}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105"
                >
                  {gameState === 'start' ? 'Start Game' : 'Play Again'}
                </button>
            </div>
        )
    }
    
    return (
        <div className="w-full max-w-md mx-auto">
             <div className="text-center mb-8 text-2xl">
                <p>Level: <span className="font-bold text-purple-300">{level}</span></p>
            </div>
            
            <div className="bg-slate-700 p-8 rounded-lg text-center mb-6 h-32 flex items-center justify-center">
                {gameState === 'showing' ? (
                     <p className="text-8xl font-bold animate-pulse">{sequence[currentIndex]}</p>
                ) : (
                     <p className="text-4xl text-gray-400">Your turn...</p>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    pattern="[0-9]*"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-4 text-3xl text-center bg-gray-900 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Enter the sequence"
                    disabled={gameState !== 'waiting'}
                    autoFocus
                />
            </form>
        </div>
    )
  }

  return (
    <GameContainer title="Number Sequence" onExit={onExit}>
      <div className="flex flex-col items-center">
        {renderContent()}
      </div>
    </GameContainer>
  );
};

export default NumberSequence;