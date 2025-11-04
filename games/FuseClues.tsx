import React, { useState, useEffect, useCallback } from 'react';
import type { GameComponentProps } from '../types';
import { PauseIcon, PowerIcon } from '../components/icons';

type NumberTile = {
    value: number;
    id: number; // For stable keys during rendering
};

type TrialData = {
    allNumbers: number[];
    fixedNumbers: number[];
};

const TRIALS: TrialData[] = [
    { allNumbers: [7, 33, 36, 126, 399], fixedNumbers: [7, 36, 126] },
    { allNumbers: [8, 15, 42, 91, 108, 215], fixedNumbers: [8, 91, 215] },
    { allNumbers: [2, 11, 54, 73, 150, 225, 400], fixedNumbers: [11, 150, 400] },
    { allNumbers: [19, 28, 83, 119, 345, 501, 620, 811], fixedNumbers: [19, 119, 501, 811] },
];

const POINTS_PER_TRIAL = 2500;

type GamePhase = 'playing' | 'feedback' | 'finished';

const FuseClues: React.FC<GameComponentProps> = ({ onExit }) => {
    const [phase, setPhase] = useState<GamePhase>('playing');
    const [score, setScore] = useState(0);
    const [trialIndex, setTrialIndex] = useState(0);
    
    const [unfusedNumbers, setUnfusedNumbers] = useState<NumberTile[]>([]);
    const [fuseSlots, setFuseSlots] = useState<(NumberTile | null)[]>([]);

    const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);

    const startTrial = useCallback((index: number) => {
        if (index >= TRIALS.length) {
            setPhase('finished');
            return;
        }

        const trialData = TRIALS[index];
        const unfused = trialData.allNumbers
            .filter(n => !trialData.fixedNumbers.includes(n))
            .map((n, i) => ({ value: n, id: i }));

        const slots = trialData.allNumbers.map(n => {
            if (trialData.fixedNumbers.includes(n)) {
                return { value: n, id: 100 + n }; // Fixed numbers get a special ID
            }
            return null;
        });

        setTrialIndex(index);
        setUnfusedNumbers(unfused);
        setFuseSlots(slots);
        setPhase('playing');
        setFeedbackState(null);
    }, []);

    useEffect(() => {
        startTrial(0);
    }, [startTrial]);

    const handleUnfusedClick = (clickedNumber: NumberTile) => {
        if (phase !== 'playing') return;

        const nextEmptySlotIndex = fuseSlots.findIndex(slot => slot === null);
        if (nextEmptySlotIndex !== -1) {
            const newSlots = [...fuseSlots];
            newSlots[nextEmptySlotIndex] = clickedNumber;
            setFuseSlots(newSlots);

            setUnfusedNumbers(unfusedNumbers.filter(n => n.id !== clickedNumber.id));
        }
    };

    const handleFuseSlotClick = (clickedNumber: NumberTile, index: number) => {
        if (phase !== 'playing' || TRIALS[trialIndex].fixedNumbers.includes(clickedNumber.value)) {
            return; // Can't remove fixed numbers
        }

        const newSlots = [...fuseSlots];
        newSlots[index] = null;
        setFuseSlots(newSlots);
        
        setUnfusedNumbers([...unfusedNumbers, clickedNumber]);
    };

    const handleSubmit = () => {
        if (phase !== 'playing' || fuseSlots.some(s => s === null)) return;

        const userSequence = fuseSlots.map(s => s!.value);
        const isCorrect = userSequence.every((num, i) => i === 0 || num >= userSequence[i - 1]);

        if (isCorrect) {
            setScore(s => s + POINTS_PER_TRIAL);
            setFeedbackState('correct');
            setPhase('feedback');
            setTimeout(() => {
                startTrial(trialIndex + 1);
            }, 1500);
        } else {
            setFeedbackState('incorrect');
            setTimeout(() => setFeedbackState(null), 500);
        }
    };

    const renderNumberTile = (tile: NumberTile, isUnfused: boolean) => {
        const isFixed = !isUnfused && TRIALS[trialIndex].fixedNumbers.includes(tile.value);
        return (
            <button
                key={tile.id}
                onClick={() => isUnfused ? handleUnfusedClick(tile) : handleFuseSlotClick(tile, fuseSlots.findIndex(s => s?.id === tile.id))}
                className={`w-20 h-12 flex items-center justify-center rounded-md font-bold text-3xl text-black transition-transform duration-200
                    ${isFixed ? 'bg-teal-300' : 'bg-yellow-400 cursor-pointer hover:scale-110'}
                    border-2 border-white/50 shadow-lg`}
                disabled={phase !== 'playing'}
            >
                {tile.value}
            </button>
        );
    };

    if (phase === 'finished') {
        return (
            <div className="w-[50rem] h-[32rem] p-6 bg-[#0a3939] text-white rounded-lg flex flex-col justify-center items-center font-sans">
                <h1 className="text-5xl font-bold mb-4">Congratulations!</h1>
                <p className="text-3xl mb-8">Final Score: <span className="font-bold text-yellow-300">{score}</span></p>
                <button 
                    onClick={() => { setScore(0); startTrial(0); }}
                    className="px-8 py-3 bg-yellow-500 rounded-lg font-semibold text-2xl text-black hover:bg-yellow-600 transition-colors"
                >
                    Play Again
                </button>
            </div>
        )
    }

    const shakeClass = feedbackState === 'incorrect' ? 'animate-shake' : '';

    return (
        <div className="w-[50rem] h-[32rem] p-4 bg-[#0a3939] rounded-lg flex flex-col font-sans text-white select-none">
            {/* Header */}
            <header className="flex justify-between items-center px-2 mb-4">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><PauseIcon className="w-7 h-7"/></button>
                <div className="flex space-x-6 text-center bg-[#072c2c] p-2 rounded-md">
                    <div className="px-3">
                        <div className="text-sm text-gray-400">TRIAL</div>
                        <div className="text-2xl font-bold">{trialIndex + 1} of {TRIALS.length}</div>
                    </div>
                     <div className="px-3">
                        <div className="text-sm text-gray-400">SCORE</div>
                        <div className="text-2xl font-bold">{score}</div>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-grow flex flex-col justify-between items-center p-4">
                {/* Unfused Numbers Area */}
                <div className="w-full h-2/5 bg-[#072c2c]/50 rounded-lg border-2 border-t-[#0c4b4b] border-l-[#0c4b4b] border-b-[#062424] border-r-[#062424] p-4 flex justify-center items-center gap-4">
                    {unfusedNumbers.map(tile => renderNumberTile(tile, true))}
                </div>

                {/* Controls */}
                <div className={`flex items-center w-full justify-center gap-4 ${shakeClass}`}>
                    <button className="px-8 py-3 rounded-full bg-[#0a2e2e] text-teal-300 text-lg font-bold border border-teal-600 hover:bg-teal-900 transition-colors">HINT</button>
                    <div className="p-3 bg-[#0a2e2e] rounded-md border border-teal-600">
                        <PowerIcon className="w-8 h-8 text-yellow-400"/>
                    </div>
                    <button onClick={handleSubmit} className="px-8 py-3 rounded-full bg-[#0a2e2e] text-teal-300 text-lg font-bold border border-teal-600 hover:bg-teal-900 transition-colors">SUBMIT</button>
                </div>

                {/* Fuse Line */}
                <div className="w-full relative h-24 flex justify-center items-center">
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-[#072c2c] -translate-y-1/2">
                         <div
                            className="h-full bg-yellow-400 transition-all duration-1000"
                            style={{ width: feedbackState === 'correct' ? '100%' : '0%' }}
                        ></div>
                    </div>
                    <div className="relative flex items-center justify-center gap-4 z-10">
                        {fuseSlots.map((slot, index) => (
                            <div key={index} className="w-20 h-12">
                                {slot ? renderNumberTile(slot, false) : (
                                    <div className="w-full h-full rounded-md bg-orange-500/20 border-2 border-dashed border-orange-500/50" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FuseClues;