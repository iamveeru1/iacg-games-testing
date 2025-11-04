import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameComponentProps } from '../types';
import { PauseIcon, ArrowLeftIcon, ArrowRightIcon, PlayIcon, RestartIcon, ExitIcon } from '../components/icons';

const GAME_DURATION = 60;
const TOTAL_ROUNDS = 10;
const SCORE_PER_CORRECT = 50;
const TIME_PENALTY = 2; // seconds for incorrect answer

const COLORS = [
    { name: 'blue', className: 'text-blue-500' },
    { name: 'red', className: 'text-red-500' },
    { name: 'yellow', className: 'text-yellow-500' },
    { name: 'green', className: 'text-green-500' },
    { name: 'black', className: 'text-black' },
    { name: 'purple', className: 'text-purple-500' },
    { name: 'orange', className: 'text-orange-500' },
];

const getRandomItem = (arr: any[], exclude: any = null) => {
    let item;
    do {
        item = arr[Math.floor(Math.random() * arr.length)];
    } while (item === exclude);
    return item;
};

interface Trial {
    meaningWord: string;
    meaningColorClass: string;
    textColorWord: string;
    textColorColorClass: string;
    isMatch: boolean;
}

const generateTrial = (): Trial => {
    const isMatch = Math.random() > 0.5;
    const meaning = getRandomItem(COLORS);
    
    // Meaning box: word is `meaning.name`, color can be anything
    const meaningBoxColor = getRandomItem(COLORS);

    // Text Color box: color is based on `isMatch`, word can be anything
    const textColorBoxWord = getRandomItem(COLORS);
    const textColorBoxColor = isMatch ? meaning : getRandomItem(COLORS, meaning);
    
    return {
        meaningWord: meaning.name,
        meaningColorClass: meaningBoxColor.className,
        textColorWord: textColorBoxWord.name,
        textColorColorClass: textColorBoxColor.className,
        isMatch: isMatch,
    };
};

type GamePhase = 'instructions' | 'playing' | 'paused' | 'finished';

const ColorMatch: React.FC<GameComponentProps> = ({ onExit }) => {
    const [phase, setPhase] = useState<GamePhase>('instructions');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [trial, setTrial] = useState<Trial>(generateTrial());
    const [progress, setProgress] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const timerRef = useRef<number | null>(null);
    
    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
    
    const startTimer = () => {
        stopTimer();
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    stopTimer();
                    setPhase('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setProgress(0);
        setTrial(generateTrial());
        setPhase('playing');
        startTimer();
    };
    
    const handleAnswer = useCallback((userAnswer: boolean) => {
        if (phase !== 'playing') return;

        if (userAnswer === trial.isMatch) {
            setScore(s => s + SCORE_PER_CORRECT);
            setProgress(p => (p < TOTAL_ROUNDS ? p + 1 : TOTAL_ROUNDS));
            setFeedback('correct');
        } else {
            setTimeLeft(t => Math.max(0, t - TIME_PENALTY));
            setFeedback('incorrect');
        }
        
        setTimeout(() => {
            setTrial(generateTrial());
            setFeedback(null);
        }, 300);

    }, [phase, trial.isMatch]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handleAnswer(false);
            if (e.key === 'ArrowRight') handleAnswer(true);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleAnswer]);

    useEffect(() => {
      return () => stopTimer(); // Cleanup on unmount
    }, []);

    const handlePause = () => {
        if (phase === 'playing') {
            stopTimer();
            setPhase('paused');
        }
    };
    
    const handleResume = () => {
        if (phase === 'paused') {
            startTimer();
            setPhase('playing');
        }
    };

    const renderGame = () => {
        let containerClass = 'bg-[#6B4F3A]';
        if (feedback === 'correct') containerClass = 'bg-green-800 animate-flash-correct';
        if (feedback === 'incorrect') containerClass = 'bg-red-800 animate-flash-incorrect';
        
        return (
            <div className={`p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl text-gray-800 font-sans transition-colors duration-200 ${containerClass}`}>
                <header className="flex justify-between items-center mb-6">
                    <button onClick={handlePause} className="bg-[#45a4c4] text-white p-2 rounded-md hover:bg-[#3a8da7] transition-colors">
                        <PauseIcon className="w-8 h-8"/>
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-200/50 p-2 rounded-md text-center">
                            <div className="text-sm text-gray-700 font-bold">TIME</div>
                            <div className="text-3xl font-bold text-gray-900">{`0:${timeLeft.toString().padStart(2, '0')}`}</div>
                        </div>
                        <div className="bg-gray-200/50 p-2 rounded-md text-center">
                            <div className="text-sm text-gray-700 font-bold">SCORE</div>
                            <div className="text-3xl font-bold text-gray-900">{score}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                            <div key={i} className={`w-4 h-4 rounded-full border-2 border-gray-400 ${i < progress ? 'bg-gray-400' : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                </header>

                <main>
                    <p className="text-3xl text-center text-gray-200 mb-8">Does the meaning match the text color?</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-64 h-48 flex items-center justify-center">
                                <span className={`text-7xl font-bold ${trial.meaningColorClass}`}>{trial.meaningWord}</span>
                            </div>
                            <div className="mt-4 text-2xl text-gray-300 bg-gray-600/50 py-1 px-4 rounded">meaning</div>
                        </div>
                        <div className="flex flex-col items-center">
                             <div className="bg-white p-8 rounded-lg shadow-lg text-center w-64 h-48 flex items-center justify-center">
                                <span className={`text-7xl font-bold ${trial.textColorColorClass}`}>{trial.textColorWord}</span>
                            </div>
                            <div className="mt-4 text-2xl text-gray-300 bg-gray-600/50 py-1 px-4 rounded">text color</div>
                        </div>
                    </div>
                     <div className="flex justify-center items-center gap-4">
                        <button onClick={() => handleAnswer(false)} className="bg-gray-200/50 p-4 rounded-lg flex items-center gap-2 text-gray-800 hover:bg-gray-200/80 transition-colors">
                            <ArrowLeftIcon className="w-8 h-8"/>
                            <span className="text-2xl font-bold">NO</span>
                        </button>
                         <button onClick={() => handleAnswer(true)} className="bg-gray-200/50 p-4 rounded-lg flex items-center gap-2 text-gray-800 hover:bg-gray-200/80 transition-colors">
                            <span className="text-2xl font-bold">YES</span>
                             <ArrowRightIcon className="w-8 h-8"/>
                        </button>
                    </div>
                </main>
            </div>
        );
    };
    
    const renderInstructions = () => (
        <div className="text-center p-6 bg-[#6B4F3A] rounded-lg max-w-2xl mx-auto text-white">
            <h3 className="text-4xl font-bold mb-4 text-gray-200">Color Match</h3>
            <p className="text-xl text-gray-300 mb-6">Your goal is to determine if the meaning of the word on the left matches the color of the text on the right.</p>
            <p className="text-xl text-gray-300 mb-8">Use the arrow keys or on-screen buttons to answer. Answer as many as you can before time runs out!</p>
            <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">Start Game</button>
        </div>
    );
    
    const renderFinished = () => (
         <div className="text-center p-10 bg-[#6B4F3A] rounded-lg max-w-2xl mx-auto text-white">
            <h3 className="text-5xl font-bold text-gray-100 mb-2">Time's Up!</h3>
            <p className="text-2xl mb-6 text-gray-200">Your final score is: <span className="font-bold text-yellow-300">{score}</span></p>
            <div className="flex justify-center gap-4">
              <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 font-bold py-3 px-8 rounded-lg text-2xl">Play Again</button>
              <button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 font-bold py-3 px-8 rounded-lg text-2xl">Quit</button>
            </div>
        </div>
    );

    const renderPaused = () => (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 animate-fade-in" style={{borderRadius: '0.75rem'}}>
          <div className="bg-[#5a4232] p-6 rounded-lg w-[320px] text-white flex flex-col border border-gray-500">
              <h3 className="text-3xl font-bold text-center mb-6">Paused</h3>
              <div className="w-full flex flex-col space-y-3">
                  <button onClick={handleResume} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-xl flex items-center justify-center gap-2"><PlayIcon className="w-6 h-6"/>Resume</button>
                  <button onClick={startGame} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg text-xl flex items-center justify-center gap-2"><RestartIcon className="w-6 h-6"/>Restart</button>
                  <button onClick={onExit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-xl flex items-center justify-center gap-2"><ExitIcon className="w-6 h-6"/>Quit</button>
              </div>
          </div>
        </div>
    );

    switch (phase) {
        case 'instructions':
            return renderInstructions();
        case 'finished':
            return renderFinished();
        case 'playing':
        case 'paused':
            return (
                <div className="relative">
                    {renderGame()}
                    {phase === 'paused' && renderPaused()}
                </div>
            )
        default:
            return null;
    }
};

export default ColorMatch;