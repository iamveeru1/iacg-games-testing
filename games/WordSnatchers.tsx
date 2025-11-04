import React, { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from '../types';
import { GiftIcon, PauseIcon, PlayIcon, RestartIcon, ExitIcon, HeartIcon, MoonIcon, CloseIcon, QuestionMarkIcon, SquareIcon, DropletIcon, PlayCircleIcon } from '../components/icons';

const wordPuzzles = [
    { word: "PEEK", clue: "quick and furtive look" },
    { word: "TRIP", clue: "a single course of travel" },
    { word: "GLUM", clue: "moody" },
    { word: "GOAT", clue: "a horned and hoofed animal" },
    { word: "FED", clue: "gave food to eat" },
    { word: "FEET", clue: "lower extremities of the leg" },
    { word: "WAVY", clue: "having a series of repeating curves" },
    { word: "HUE", clue: "color; shade" },
    { word: "DEEP", clue: "mysterious; abstruse" },
    { word: "BOOK", clue: "a written or printed work consisting of pages" },
    { word: "RAIN", clue: "water falling in drops from vapor in the sky" },
    { word: "FIRE", clue: "combustion or burning, in which substances combine chemically with oxygen" },
    { word: "MOON", clue: "the natural satellite of the earth, visible at night" },
    { word: "STAR", clue: "a fixed luminous point in the night sky" },
    { word: "WIND", clue: "the perceptible natural movement of the air" },
    { word: "SNOW", clue: "atmospheric water vapor frozen into ice crystals" },
    { word: "TREE", clue: "a woody perennial plant, typically having a main trunk" },
    { word: "BIRD", clue: "a warm-blooded egg-laying vertebrate with feathers and wings" },
    { word: "FISH", clue: "a limbless cold-blooded vertebrate animal with gills and fins" },
    { word: "LOVE", clue: "an intense feeling of deep affection" },
];

type ScrambledLetter = { letter: string; id: number };
type MovingLetter = {
    letter: string;
    id: number;
    position: number; // 0 = bottom, 100 = top
    isMoving: boolean;
};

// --- Sub-components for different game states ---

const IntroScreen = ({ onPlay }: { onPlay: () => void; }) => (
    <div className="w-full h-full flex flex-col bg-white text-white animate-fade-in">
        <main className="flex-grow flex flex-col overflow-y-auto">
            {/* Illustration & Title Section */}
            <div className="relative h-[350px] flex-shrink-0 flex flex-col justify-center items-center bg-gradient-to-b from-[#502a6e] to-[#3c1f51] overflow-hidden">
                {/* Background Illustrations */}
                <div className="absolute inset-0">
                    {/* TV */}
                    <div className="absolute bottom-0 -left-10 w-80 h-64">
                        <div className="relative w-full h-full bg-[#332244] border-8 border-[#221133] rounded-3xl flex flex-col items-center p-2 pt-4 shadow-2xl">
                            <div className="w-full h-full bg-black/20 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '100% 3px' }}></div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#221133] rounded-b-md"></div>
                            <div className="absolute top-4 right-[-12px] w-3 h-8 bg-[#221133] rounded-sm"></div>
                        </div>
                    </div>
                    {/* UFO */}
                    <div className="absolute top-1/2 -translate-y-[80%] right-[25%] w-64 h-24">
                        <div className="absolute bottom-0 w-full h-12 bg-[#c0b8d7] rounded-full shadow-lg"></div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-[#e8e4f5] rounded-t-full"></div>
                        <div className="absolute top-0 w-full h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[100px] border-b-purple-300/20 opacity-70"></div>
                    </div>

                    {/* Plant */}
                    <div className="absolute bottom-0 right-0 w-48 h-48">
                        <div className="absolute bottom-0 right-0 w-32 h-24 bg-[#2a1a3a] rounded-tl-full"></div>
                        <div className="absolute bottom-24 right-10 w-2 h-20 bg-[#2a1a3a] -rotate-12"></div>
                        <div className="absolute bottom-40 right-16 w-10 h-10 bg-[#2a1a3a] rounded-full"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-20 text-center text-white">
                    <h1 className="text-6xl font-extrabold">Word Snatchers</h1>
                    <p className="text-xl mt-2">Exercise your Vocabulary by unscrambling the word.</p>
                    <div className="mt-8 flex flex-col justify-center items-center gap-4">
                        <button onClick={onPlay} className="px-20 py-5 bg-orange-500 hover:bg-orange-600 font-bold rounded-full text-2xl transition-transform hover:scale-105 shadow-lg">Play</button>
                        <button className="flex items-center gap-2 px-6 py-3 font-bold text-lg">
                            <PlayCircleIcon className="w-8 h-8" /> PLAY IN ZEN
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white text-gray-800 p-8 relative z-10 shadow-t-2xl flex-grow">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex gap-2 mb-4">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-md font-semibold text-xs tracking-wider">LANGUAGE</span>
                            <span className="border border-gray-400 text-gray-600 px-3 py-1 rounded-md font-semibold text-xs tracking-wider">VOCABULARY</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Vocabulary</h3>
                        <p className="text-gray-600 mt-1">Vocabulary is the collection of words a person knows and can use in a language.</p>
                        <p className="mt-2 text-gray-600"><span className="font-bold text-gray-800">Example:</span> Writing clear emails and texts by choosing words that accurately convey your meaning.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-center md:border-l md:border-gray-200 md:pl-8">
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider">TOTAL PLAYS</p>
                            <p className="text-4xl font-bold text-gray-800 mt-1">4</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider">EXPLORER</p>
                            <div className="flex justify-center items-center gap-2 mt-2">
                                <div className="w-5 h-5 border-2 border-cyan-400 rounded-full"></div>
                                <div className="w-5 h-5 border-2 border-cyan-400 bg-cyan-400 rounded-full"></div>
                                <div className="w-5 h-5 border-2 border-cyan-400 rounded-full"></div>
                                <div className="w-5 h-5 border-2 border-cyan-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="col-span-2"><hr /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider">TOP SCORES</p>
                            <p className="text-4xl font-bold text-gray-800 mt-1">2,330</p>
                            <p className="text-sm text-gray-500">Points</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold tracking-wider">&nbsp;</p>
                            <p className="text-4xl font-bold text-gray-800 mt-1">10</p>
                            <p className="text-sm text-gray-500">Letters</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

const LevelSelectScreen = ({ unlockedLevel, onSelectLevel }: {
    unlockedLevel: number;
    onSelectLevel: (level: number) => void;
}) => (
    <div className="w-[896px] h-[672px] flex flex-col items-center justify-center text-white bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-semibold mb-12 text-center">Select Level</h2>
        <div className="grid grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => {
                const level = i + 1;
                const isUnlocked = level <= unlockedLevel;
                return (
                    <button
                        key={level}
                        onClick={() => isUnlocked && onSelectLevel(level)}
                        disabled={!isUnlocked}
                        className={`w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold border-2
                            ${isUnlocked
                                ? 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 cursor-pointer'
                                : 'bg-purple-900 border-purple-700 text-purple-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {level}
                    </button>
                );
            })}
        </div>
    </div>
);

const GameScreen = ({ level, score, puzzleState, onLetterClick, onDelete, onShift, onPause, onTimeOut }: {
    level: number;
    score: number;
    puzzleState: { word: string; clue: string; scrambledLetters: ScrambledLetter[]; answer: ScrambledLetter[]; } | null;
    onLetterClick: (option: ScrambledLetter) => void;
    onDelete: () => void;
    onShift: () => void;
    onPause: () => void;
    onTimeOut: () => void;
}) => {
    const [movingLetters, setMovingLetters] = React.useState<MovingLetter[]>([]);

    if (!puzzleState) return null;

    const { word, clue, scrambledLetters, answer } = puzzleState;
    const answerString = answer.map(a => a.letter).join('');
    const isCorrect = answerString === word && answer.length === word.length;
    const isIncorrect = answer.length === word.length && answerString !== word;
    const shakeClass = isIncorrect ? 'animate-shake' : '';

    // Initialize letters when puzzle changes
    React.useEffect(() => {
        const initialLetters = scrambledLetters.map((letter, index) => ({
            ...letter,
            position: 0,
            isMoving: true,
        }));
        setMovingLetters(initialLetters);
    }, [word]);

    // Handle wrong answers
    React.useEffect(() => {
        if (isIncorrect) {
            setTimeout(() => {
                // Add all answer letters back to moving letters
                const movingOnes = movingLetters.filter(l => l.isMoving);
                const currentPos = movingOnes.length > 0 ? Math.max(...movingOnes.map(l => l.position)) : 0;

                setMovingLetters(prev => {
                    const answerLettersAsMoving = answer.map(answerLetter => ({
                        letter: answerLetter.letter,
                        id: answerLetter.id,
                        position: Math.max(0, currentPos - 10),
                        isMoving: true,
                    }));
                    return [...prev, ...answerLettersAsMoving];
                });
            }, 800);
        }
    }, [isIncorrect, answer, movingLetters]);

    // Animation loop
    React.useEffect(() => {
        if (isCorrect) return;

        const interval = setInterval(() => {
            setMovingLetters(prev => {
                let shouldTimeout = false;

                const updated = prev.map(letter => {
                    if (!letter.isMoving) return letter;

                    const newPosition = Math.min(letter.position + 0.8, 100);

                    if (newPosition >= 80) {
                        shouldTimeout = true;
                    }

                    return { ...letter, position: newPosition };
                });

                if (shouldTimeout) {
                    setTimeout(() => onTimeOut(), 0);
                }

                return updated;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isCorrect, onTimeOut]);

    const handleLetterClick = (clickedLetter: MovingLetter) => {
        if (!clickedLetter.isMoving || answer.length >= word.length) return;

        // Add visual feedback - temporarily scale up the letter before removing
        const letterElement = document.querySelector(`[data-letter-id="${clickedLetter.id}"]`) as HTMLElement;
        if (letterElement) {
            letterElement.style.transform = 'scale(1.3) translateY(-20px)';
            letterElement.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }

        // Delay removal to show the animation
        setTimeout(() => {
            // Remove the clicked letter from moving letters (it will appear in input box)
            setMovingLetters(prev =>
                prev.filter(letter => letter.id !== clickedLetter.id)
            );

            // Add to answer
            onLetterClick({ letter: clickedLetter.letter, id: clickedLetter.id });
        }, 200);
    };

    const handleInputSlotClick = (slotIndex: number) => {
        if (slotIndex >= answer.length) return;

        const lettersToRemove = answer.slice(slotIndex);

        // Find current position of moving letters
        const movingOnes = movingLetters.filter(l => l.isMoving);
        const currentPos = movingOnes.length > 0 ? Math.max(...movingOnes.map(l => l.position)) : 0;

        // Add removed letters back to moving letters
        setMovingLetters(prev => {
            const newMovingLetters = lettersToRemove.map(removed => ({
                letter: removed.letter,
                id: removed.id,
                position: Math.max(0, currentPos - 10), // Start slightly behind current moving letters
                isMoving: true,
            }));
            return [...prev, ...newMovingLetters];
        });

        // Remove from answer
        for (let i = answer.length - 1; i >= slotIndex; i--) {
            onDelete();
        }
    };

    return (
        <div className="w-[896px] h-[672px] text-white p-6 flex flex-col relative font-sans animate-fade-in overflow-hidden rounded-lg shadow-2xl"
            style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 25%, #6D28D9 50%, #5B21B6 75%, #4C1D95 100%)',
            }}>

            {/* Add custom CSS animations */}
            <style jsx>{`
                @keyframes bounce-in {
                    0% { transform: scale(0) rotate(180deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes letter-move-up {
                    0% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-10px) scale(1.1); }
                    100% { transform: translateY(-20px) scale(1); }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                .animate-letter-move {
                    animation: letter-move-up 0.3s ease-out;
                }
            `}</style>

            {/* Background Effects - Stars/Sparkles */}
            {[...Array(15)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: '3s'
                    }}>
                </div>
            ))}

            {/* Top Header */}
            <header className="flex justify-between items-center w-full mb-6 z-10">
                <button onClick={onPause} className="text-white hover:text-gray-300 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <div className="text-white text-sm">
                    <QuestionMarkIcon className="w-6 h-6 inline mr-2" />
                    HOW TO PLAY
                </div>
                <div className="flex items-center gap-4 text-white text-sm">
                    <span>GAME SETTINGS</span>
                    <div className="flex gap-1">
                        <div className="w-6 h-6 border border-white rounded flex items-center justify-center">
                            <SquareIcon className="w-4 h-4" />
                        </div>
                        <MoonIcon className="w-6 h-6" />
                    </div>
                </div>
            </header>

            {/* Game Stats Bar */}
            <div className="bg-gradient-to-r from-pink-400/80 to-purple-400/80 rounded-full px-6 py-2 mb-8 z-10 mx-auto">
                <div className="flex items-center justify-between text-white text-sm font-semibold min-w-[300px]">
                    <span>WORDS</span>
                    <span>{level} of 12</span>
                    <span>SCORE</span>
                    <span>{score}</span>
                </div>
            </div>

            {/* Input Boxes Area - Enhanced to match screenshot */}
            <div className="flex justify-center mb-8 z-10 relative" id="input-boxes">
                <div className="bg-gradient-to-r from-pink-300/80 to-purple-300/80 rounded-full px-8 py-4 shadow-lg">
                    <div className={`flex gap-3 ${shakeClass}`}>
                        {Array.from({ length: word.length }).map((_, i) => {
                            const letterInfo = answer[i];
                            const isFilled = !!letterInfo;
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleInputSlotClick(i)}
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 border-2 shadow-md ${isFilled
                                        ? 'bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer transform hover:scale-105'
                                        : 'bg-white/20 border-white/40 cursor-default text-white/60'
                                        }`}
                                >
                                    {letterInfo && (
                                        <span key={letterInfo.id} className="animate-bounce-in">
                                            {letterInfo.letter}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Clue Box - Clean Design */}
            <div className="bg-purple-900/80 border-2 border-purple-400/60 rounded-xl px-6 py-4 mx-auto mb-8 max-w-md z-10 shadow-lg">
                <p className="text-white text-center font-medium">{clue}</p>
            </div>

            {/* Game Area for Moving Letters */}
            <div className="flex-grow relative overflow-hidden">
                {/* Moving Letters */}
                {movingLetters.map((letter, index) => {
                    const leftPosition = `calc(50% + ${(index - scrambledLetters.length / 2 + 0.5) * 76}px - 32px)`;
                    const bottomPosition = `${letter.position}%`;

                    // Warning effects when close to top
                    const isNearTop = letter.position > 65;
                    const isVeryClose = letter.position > 75;

                    return (
                        <button
                            key={letter.id}
                            data-letter-id={letter.id}
                            onClick={() => handleLetterClick(letter)}
                            disabled={!letter.isMoving}
                            className={`absolute w-16 h-16 rounded-xl text-3xl font-bold flex items-center justify-center transition-all duration-300 shadow-lg z-30 transform
                                ${letter.isMoving
                                    ? 'bg-white text-black hover:scale-110 hover:shadow-xl cursor-pointer hover:z-40'
                                    : 'bg-purple-800/60 text-white/60 cursor-not-allowed'
                                }
                                ${isVeryClose ? 'border-2 border-red-500 animate-pulse' : isNearTop ? 'border-2 border-yellow-400' : ''}
                            `}
                            style={{
                                left: leftPosition,
                                bottom: bottomPosition,
                                opacity: isVeryClose ? '0.8' : isNearTop ? '0.9' : '1',
                                animation: isVeryClose
                                    ? 'blink 0.8s ease-in-out infinite'
                                    : isNearTop
                                        ? 'blink 1.5s ease-in-out infinite'
                                        : 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (letter.isMoving) {
                                    e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (letter.isMoving) {
                                    e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                                }
                            }}
                        >
                            {letter.letter}
                        </button>
                    );
                })}
            </div>

            {/* Left side controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-6 flex flex-col items-center space-y-3 z-20">
                <button onClick={onDelete} className="px-3 py-2 bg-purple-800/60 border border-white/30 rounded-lg text-center font-semibold hover:bg-purple-700/60 transition-colors text-white text-xs">
                    <span>DELETE</span><br /><span>LETTER</span>
                </button>
                <button onClick={onShift} className="px-3 py-2 bg-purple-800/60 border border-white/30 rounded-lg text-center font-semibold hover:bg-purple-700/60 transition-colors text-white text-xs">
                    <span>SHIFT</span><br /><span>HINT</span>
                </button>
            </div>
        </div>
    );
};

const PausedScreen = ({ onResume, onRestart, onQuit }: { onResume: () => void; onRestart: () => void; onQuit: () => void; }) => (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 animate-fade-in">
        <div className="bg-gradient-to-b from-[#4a0e71] to-[#25093f] p-8 rounded-lg text-center border-2 border-purple-400/50 shadow-2xl">
            <h2 className="text-5xl font-bold mb-8 text-white">Paused</h2>
            <div className="flex flex-col gap-4 w-64">
                <button onClick={onResume} className="px-12 py-3 bg-orange-500 hover:bg-orange-600 font-bold rounded-lg text-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 text-white"><PlayIcon className="w-6 h-6" />Resume</button>
                <button onClick={onRestart} className="px-8 py-3 bg-purple-700 hover:bg-purple-600 font-bold rounded-lg text-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 text-white"><RestartIcon className="w-6 h-6" />Restart</button>
                <button onClick={onQuit} className="px-8 py-3 bg-gray-600 hover:bg-gray-500 font-bold rounded-lg text-xl transition-transform hover:scale-105 flex items-center justify-center gap-2 text-white"><ExitIcon className="w-6 h-6" />Quit</button>
            </div>
        </div>
    </div>
);

// --- Main Game Component ---

const WordSnatchers: React.FC<GameComponentProps> = ({ onExit }) => {
    const [gameState, setGameState] = useState<'intro' | 'level-select' | 'playing'>('intro');
    const [isPaused, setIsPaused] = useState(false);
    const [unlockedLevel, setUnlockedLevel] = useState(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);

    const [puzzleState, setPuzzleState] = useState<{
        word: string;
        clue: string;
        scrambledLetters: ScrambledLetter[];
        answer: ScrambledLetter[];
    } | null>(null);

    const setupLevel = useCallback((level: number) => {
        const puzzle = wordPuzzles[(level - 1) % wordPuzzles.length];
        const wordUpper = puzzle.word.toUpperCase();

        const letters = wordUpper.split('');
        const scrambledLetters = [...letters].sort(() => Math.random() - 0.5);
        const uniqueScrambled = scrambledLetters.map((l, i) => ({ letter: l, id: i }));

        setPuzzleState({
            word: wordUpper,
            clue: puzzle.clue,
            scrambledLetters: uniqueScrambled,
            answer: [],
        });
        setCurrentLevel(level);
        setGameState('playing');
        setIsPaused(false);
    }, []);

    const handleLetterClick = (clickedLetter: ScrambledLetter) => {
        if (!puzzleState || puzzleState.answer.length >= puzzleState.word.length) return;

        const isUsed = puzzleState.answer.some(a => a.id === clickedLetter.id);
        if (isUsed) return;

        setPuzzleState(prev => {
            if (!prev) return null;
            return { ...prev, answer: [...prev.answer, clickedLetter] };
        });
    };

    const handleDelete = () => {
        if (!puzzleState || puzzleState.answer.length === 0) return;
        setPuzzleState(prev => {
            if (!prev) return null;
            return { ...prev, answer: prev.answer.slice(0, -1) };
        });
    };

    const handleShift = () => {
        if (!puzzleState) return;
        const answerIds = new Set(puzzleState.answer.map(a => a.id));
        const unusedLetters = puzzleState.scrambledLetters.filter(l => !answerIds.has(l.id));
        const shuffledUnused = unusedLetters.sort(() => Math.random() - 0.5);

        const newScrambled = puzzleState.scrambledLetters.map(l => {
            if (answerIds.has(l.id)) return l;
            return shuffledUnused.pop()!;
        });

        setPuzzleState(prev => prev ? { ...prev, scrambledLetters: newScrambled } : null);
    };

    const handleRestart = () => {
        setScore(0);
        setUnlockedLevel(1);
        setGameState('level-select');
        setIsPaused(false);
    };

    const handleTimeOut = useCallback(() => {
        if (currentLevel < 12) {
            setupLevel(currentLevel + 1);
        } else {
            setGameState('level-select');
        }
    }, [currentLevel, setupLevel]);

    useEffect(() => {
        if (gameState === 'playing' && puzzleState && puzzleState.answer.length === puzzleState.word.length) {
            const userAnswer = puzzleState.answer.map(a => a.letter).join('');
            if (userAnswer === puzzleState.word) {
                // Correct answer - move to next level immediately
                setScore(prev => prev + 100 + (puzzleState.word.length * 10));

                if (currentLevel === unlockedLevel && unlockedLevel < 12) {
                    setUnlockedLevel(prev => prev + 1);
                }
                if (currentLevel < 12) {
                    setupLevel(currentLevel + 1);
                } else {
                    setGameState('level-select');
                }
            } else {
                // Wrong answer - shake and clear after delay
                setTimeout(() => {
                    setPuzzleState(prev => prev ? { ...prev, answer: [] } : null);
                }, 800);
            }
        }
    }, [puzzleState, currentLevel, unlockedLevel, setupLevel, gameState]);



    const renderContent = () => {
        switch (gameState) {
            case 'intro':
                return <IntroScreen onPlay={() => setGameState('level-select')} />;
            case 'level-select':
                return (
                    <LevelSelectScreen
                        unlockedLevel={unlockedLevel}
                        onSelectLevel={setupLevel}
                    />
                );
            case 'playing':
                return (
                    <>
                        <GameScreen
                            level={currentLevel}
                            score={score}
                            puzzleState={puzzleState}
                            onLetterClick={handleLetterClick}
                            onDelete={handleDelete}
                            onShift={handleShift}
                            onPause={() => setIsPaused(true)}
                            onTimeOut={handleTimeOut}
                        />
                        {isPaused && <PausedScreen onResume={() => setIsPaused(false)} onRestart={handleRestart} onQuit={onExit} />}
                    </>
                );
            default: return null;
        }
    };

    return <div className="w-full h-screen flex items-center justify-center bg-gray-900">{renderContent()}</div>;
};

export default WordSnatchers;