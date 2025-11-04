import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameContainer from '../components/GameContainer';
import type { GameComponentProps } from '../types';
import { generateWordChallenge } from '../services/geminiService';

type GameState = 'start' | 'playing' | 'loading' | 'finished';
const GAME_DURATION = 80; // seconds

const WordScramble: React.FC<GameComponentProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchNewWord = useCallback(async () => {
    setGameState('loading');
    setFeedback('');
    setUserInput('');
    const wordData = await generateWordChallenge('common objects', 'medium');
    if (wordData) {
      setCurrentWord(wordData.originalWord.toUpperCase());
      setScrambledWord(wordData.scrambledWord.toUpperCase());
      setGameState('playing');
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setFeedback('Error fetching new word. Try again.');
      setGameState('finished');
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    fetchNewWord();
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  };

  const stopGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState('finished');
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      stopGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      setScore(prev => prev + 10);
      setFeedback('Correct!');
      fetchNewWord();
    } else {
      setFeedback('Try again!');
    }
    setUserInput('');
  };

  const renderContent = () => {
    if (gameState === 'start' || gameState === 'finished') {
      return (
        <div className="text-center">
          {gameState === 'finished' && (
            <>
              <h3 className="text-5xl font-bold text-red-400 mb-2">Time's Up!</h3>
              <p className="text-2xl mb-6">Your final score is: <span className="font-bold text-white">{score}</span></p>
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
        <div className="flex justify-between items-center mb-8 text-2xl">
          <p>Score: <span className="font-bold text-purple-300">{score}</span></p>
          <p>Time: <span className="font-bold text-purple-300">{timeLeft}</span></p>
        </div>

        <div className="bg-slate-700 p-8 rounded-lg text-center mb-6">
          {gameState === 'loading' ? (
            <p className="text-4xl tracking-widest animate-pulse">LOADING...</p>
          ) : (
            <p className="text-6xl font-bold tracking-[0.3em]">{scrambledWord}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-4 text-3xl text-center bg-gray-900 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder="Your answer"
            disabled={gameState !== 'playing'}
          />
        </form>
        <p className={`text-center mt-4 h-6 text-xl font-bold ${feedback === 'Correct!' ? 'text-green-400' : 'text-red-400'}`}>{feedback}</p>
      </div>
    )
  }

  return (
    <GameContainer title="Word Scramble" onExit={onExit}>
      <div className="flex flex-col items-center">
        {renderContent()}
      </div>
    </GameContainer>
  );
};

export default WordScramble;