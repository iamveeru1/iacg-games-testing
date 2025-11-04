import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GameComponentProps } from '../types';
import { PauseIcon, PlayIcon, QuestionMarkIcon, RestartIcon, MuteIcon, ExitIcon, SoundIcon, MusicIcon } from '../components/icons';

// Game constants for dynamic difficulty
const GRID_PROGRESSION = [
  { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 4, c: 3 }, 
  { r: 4, c: 4 }, { r: 5, c: 4 }, { r: 5, c: 5 }, { r: 6, c: 5 }, { r: 6, c: 6 }
];
const MIN_TILES = 3;
const INITIAL_TILES = 3; // For the very first game
const TOTAL_TRIALS = 12;
const POINTS_PER_TILE = 250;
const BONUS_POINTS_PER_TILE = 100;
const SHOW_DURATION = 1500;
const COUNTDOWN_SECONDS = 3;

type GamePhase = 'instructions' | 'get-ready' | 'showing' | 'waiting' | 'feedback' | 'paused' | 'finished';

const MemoryMatrix: React.FC<GameComponentProps> = ({ onExit }) => {
  const [phase, setPhase] = useState<GamePhase>('instructions');
  const [previousPhase, setPreviousPhase] = useState<GamePhase | null>(null);
  const [score, setScore] = useState(0);
  const [trial, setTrial] = useState(1);
  const [gridLevel, setGridLevel] = useState(0);
  const [tilesToMemorize, setTilesToMemorize] = useState(INITIAL_TILES);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userSelection, setUserSelection] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  
  const countdownTimerRef = useRef<number | null>(null);
  const lastGameTilesRef = useRef<number | null>(null);

  const { r: gridRows, c: gridCols } = GRID_PROGRESSION[gridLevel];

  const generatePattern = useCallback((numTiles: number, rows: number, cols: number) => {
    const newPattern: number[] = [];
    const totalCells = rows * cols;
    while (newPattern.length < numTiles) {
      const randomCell = Math.floor(Math.random() * totalCells);
      if (!newPattern.includes(randomCell)) {
        newPattern.push(randomCell);
      }
    }
    setPattern(newPattern);
    setUserSelection([]);
    setMistakes([]);
  }, []);

  const startGame = useCallback(() => {
    const startTiles = lastGameTilesRef.current 
      ? Math.max(MIN_TILES, lastGameTilesRef.current - 3) 
      : INITIAL_TILES;
    
    setScore(0);
    setTrial(1);
    setGridLevel(0);
    setTilesToMemorize(startTiles);
    setCountdown(COUNTDOWN_SECONDS);
    setPhase('get-ready');
    generatePattern(startTiles, GRID_PROGRESSION[0].r, GRID_PROGRESSION[0].c);
  }, [generatePattern]);
  
  const nextTrial = useCallback(() => {
    if (trial >= TOTAL_TRIALS) {
        lastGameTilesRef.current = tilesToMemorize;
        setPhase('finished');
        return;
    }
    const wrongClicks = mistakes.length;
    let nextGridLevel = gridLevel;
    let gridChanged = false;

    // 1. Determine grid progression
    if (wrongClicks === 0 && gridLevel < GRID_PROGRESSION.length - 1) {
        nextGridLevel++;
        gridChanged = true;
    } else if (wrongClicks >= 2 && gridLevel > 0) {
        nextGridLevel--;
        gridChanged = true;
    }

    const { r: nextRows, c: nextCols } = GRID_PROGRESSION[nextGridLevel];
    let nextTiles = tilesToMemorize;

    // 2. Determine tile count
    if (gridChanged) {
        // Reset tiles for new grid size
        nextTiles = Math.min(nextRows, nextCols) + 1;
    } else {
        // Apply standard tile adjustment logic
        if (wrongClicks === 0) {
            nextTiles++;
        } else if (wrongClicks >= 2) {
            nextTiles--;
        }
        // If wrongClicks is 1, tile count remains the same
    }
    
    // 3. Clamp tile count to be valid for the grid
    nextTiles = Math.max(MIN_TILES, nextTiles);
    nextTiles = Math.min(nextTiles, nextRows * nextCols);

    setTrial(t => t + 1);
    setGridLevel(nextGridLevel);
    setTilesToMemorize(nextTiles);
    setCountdown(COUNTDOWN_SECONDS);
    setPhase('get-ready');
    generatePattern(nextTiles, nextRows, nextCols);
  }, [trial, mistakes, tilesToMemorize, gridLevel, generatePattern]);

  useEffect(() => {
    if (phase === 'get-ready') {
      countdownTimerRef.current = window.setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
      if (countdown <= 0) {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        setPhase('showing');
      }
      return () => {
        if(countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      }
    }
    if (phase === 'showing') {
      const timer = setTimeout(() => setPhase('waiting'), SHOW_DURATION);
      return () => clearTimeout(timer);
    }
    if (phase === 'feedback') {
        const correctSelections = userSelection.filter(sel => pattern.includes(sel) && !mistakes.includes(sel));
        let trialScore = correctSelections.length * POINTS_PER_TILE;
        if (mistakes.length === 0 && correctSelections.length === pattern.length) {
            trialScore += pattern.length * BONUS_POINTS_PER_TILE;
        }
        setScore(s => s + trialScore);
        const timer = setTimeout(nextTrial, 2000);
        return () => clearTimeout(timer);
    }
  }, [phase, countdown, pattern, userSelection, mistakes, nextTrial]);

  const handleCellClick = (index: number) => {
    if (phase !== 'waiting' || userSelection.includes(index) || mistakes.includes(index)) return;
    const isCorrect = pattern.includes(index);
    if (isCorrect) {
        setUserSelection(prev => [...prev, index]);
    } else {
        setMistakes(prev => [...prev, index]);
    }
  };
  
  useEffect(() => {
      if (phase === 'waiting') {
          const totalClicks = userSelection.length + mistakes.length;
          if (totalClicks >= pattern.length) {
              setPhase('feedback');
          }
      }
  }, [userSelection, mistakes, pattern.length, phase]);

  const handlePause = () => {
    setPreviousPhase(phase);
    setPhase('paused');
  };
  
  const handleResume = () => {
    if (previousPhase) {
        setPhase(previousPhase);
        setPreviousPhase(null);
    } else {
        setPhase('waiting'); // fallback
    }
  }
  
  const renderGrid = () => (
    Array.from({ length: gridRows * gridCols }).map((_, i) => {
      const isPatternCell = pattern.includes(i);
      const isSelectedCorrectly = userSelection.includes(i);
      const isSelectedIncorrectly = mistakes.includes(i);

      let cellState: 'idle' | 'showing' | 'correct' | 'incorrect' = 'idle';
      
      if (phase === 'showing' && isPatternCell) cellState = 'showing';
      else if ((phase === 'waiting' || phase === 'paused' || phase === 'get-ready') && isSelectedCorrectly) cellState = 'correct';
      else if ((phase === 'waiting' || phase === 'paused' || phase === 'get-ready') && isSelectedIncorrectly) cellState = 'incorrect';
      else if (phase === 'feedback' && isPatternCell) cellState = 'correct';
      else if (phase === 'feedback' && isSelectedIncorrectly) cellState = 'incorrect';

      const cellClasses = {
          idle: 'bg-[#372f2d] hover:bg-[#4a403d]',
          showing: 'bg-[#00bfff]',
          correct: 'bg-[#00bfff]',
          incorrect: 'bg-orange-500'
      }[cellState];

      return (
        <div
          key={i}
          onClick={() => handleCellClick(i)}
          className={`w-16 h-16 rounded-lg transition-colors duration-200 flex items-center justify-center
            ${phase === 'waiting' ? 'cursor-pointer' : 'cursor-default'} ${cellClasses}`}
        >
          {isSelectedIncorrectly && <span className="text-white text-5xl font-bold">×</span>}
        </div>
      );
    })
  );

  const renderInstructions = () => (
    <div className="text-center p-6 bg-[#2d2422] rounded-lg max-w-2xl mx-auto text-white">
        <h3 className="text-4xl font-bold mb-4">Memory Matrix Instructions</h3>
        <p className="text-xl text-gray-300 mb-6">A pattern of tiles will flash on the grid. Your task is to remember the pattern and click the tiles in the correct locations.</p>
        <ul className="text-left text-lg text-gray-400 list-disc list-inside mb-8 space-y-2">
            <li>Earn <span className="font-bold text-white">250 points</span> for every correct tile.</li>
            <li>Get a perfect round for a bonus of <span className="font-bold text-white">100 extra points</span> per tile.</li>
            <li><span className="font-bold text-white">No mistakes:</span> 1 more tile in the next trial, and the grid may grow.</li>
            <li><span className="font-bold text-white">1 mistake:</span> The number of tiles stays the same.</li>
            <li><span className="font-bold text-white">2+ mistakes:</span> 1 fewer tile in the next trial, and the grid may shrink.</li>
            <li>When you start a new game, you begin with 3 fewer tiles than your previous game's final trial.</li>
        </ul>
        {previousPhase ? (
             <button onClick={handleResume} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">Back to Game</button>
        ) : (
             <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-2xl">Start Game</button>
        )}
    </div>
  );

  const PauseMenuItem: React.FC<{icon: React.ReactNode, label: string, onClick: () => void, highlighted?: boolean}> = ({ icon, label, onClick, highlighted }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center space-x-4 w-full text-left p-3 text-xl rounded-md transition-colors group
        ${highlighted ? 'bg-[#00bfff] text-white' : 'text-[#00bfff] hover:bg-[#00bfff]/20'}`}
    >
        <div className={`transition-colors ${highlighted ? 'text-white' : 'text-[#00bfff]'}`}>
            {icon}
        </div>
        <span className="font-semibold">{label}</span>
    </button>
  );

  const renderPauseMenu = () => (
    <div className="bg-[#2d2422] p-4 rounded-lg w-[320px] text-white flex flex-col animate-fade-in">
        <div className="flex items-center space-x-3 w-full border-b border-gray-600 pb-3 mb-3 text-2xl font-semibold text-gray-300">
            <PauseIcon className="w-6 h-6"/>
            <span>Paused</span>
        </div>
        <div className="w-full flex flex-col space-y-1">
            <PauseMenuItem icon={<PlayIcon className="w-6 h-6"/>} label="Resume" onClick={handleResume} />
            <PauseMenuItem icon={<RestartIcon className="w-6 h-6"/>} label="Restart" onClick={startGame} />
             <PauseMenuItem 
                icon={isSoundMuted ? <MuteIcon className="w-6 h-6"/> : <SoundIcon className="w-6 h-6"/>} 
                label={isSoundMuted ? "Unmute Sound" : "Mute Sound"} 
                onClick={() => setIsSoundMuted(p => !p)} 
                highlighted={isSoundMuted}
            />
            <PauseMenuItem 
                icon={<MusicIcon className="w-6 h-6"/>} 
                label={isMusicMuted ? "Unmute Music" : "Mute Music"} 
                onClick={() => setIsMusicMuted(p => !p)}
                highlighted={isMusicMuted}
            />
            <PauseMenuItem icon={<ExitIcon className="w-6 h-6"/>} label="Quit" onClick={onExit} />
            <PauseMenuItem icon={<QuestionMarkIcon className="w-6 h-6"/>} label="How To Play" onClick={() => { setPreviousPhase('paused'); setPhase('instructions'); }} />
        </div>
    </div>
  );

  const renderGameContent = () => {
    if (phase === 'finished') {
         return (
            <div className="text-center text-white bg-[#2d2422] p-10 rounded-lg">
                <h3 className="text-5xl font-bold text-green-400 mb-2">Game Complete!</h3>
                <p className="text-2xl mb-6">Your final score is: <span className="font-bold">{score}</span></p>
                <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 font-bold py-3 px-8 rounded-lg text-2xl">Play Again</button>
            </div>
        )
    }

    const clicksRemaining = pattern.length - (userSelection.length + mistakes.length);

    return (
      <>
        <div className="flex justify-between items-center bg-[#2d2422]/50 p-2 px-4 rounded-lg mb-4 text-white">
            <button onClick={handlePause} className="p-2 rounded-full hover:bg-white/10">
                <PauseIcon className="w-8 h-8 text-[#00bfff]" />
            </button>
             <div className="flex space-x-2 md:space-x-4 text-center bg-[#2d2422] p-2 rounded-md">
                <div className="px-3 border-r border-gray-600">
                    <div className="text-sm text-gray-400">TILES</div>
                    <div className="text-2xl font-bold">{tilesToMemorize}</div>
                </div>
                 <div className="px-3 border-r border-gray-600">
                    <div className="text-sm text-gray-400">TRIAL</div>
                    <div className="text-2xl font-bold">{trial} of {TOTAL_TRIALS}</div>
                </div>
                 <div className="px-3">
                    <div className="text-sm text-gray-400">SCORE</div>
                    <div className="text-2xl font-bold">{score}</div>
                </div>
            </div>
        </div>

        <div className="relative flex justify-center items-center p-3 bg-[#211a18] rounded-lg w-[28rem] h-[28rem] mx-auto">
            {phase === 'paused' ? renderPauseMenu() : (
              <>
                <div 
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                  }}
                >
                    {renderGrid()}
                </div>
                {phase === 'get-ready' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-cyan-500 rounded-full flex items-center justify-center text-6xl md:text-7xl font-bold text-white animate-countdown shadow-lg">
                            {countdown > 0 ? countdown : 'Go!'}
                        </div>
                    </div>
                )}
              </>
            )}
        </div>
        
        <div className="text-center mt-4 h-8 text-xl text-gray-300">
            {phase === 'showing' && <p className="animate-pulse">Memorize...</p>}
            {phase === 'waiting' && clicksRemaining > 0 && <p>You have {clicksRemaining} tile{clicksRemaining > 1 ? 's' : ''} left to find.</p>}
        </div>
      </>
    );
  };
  
  return (
    <div className="bg-[#4a3f3c] p-4 md:p-6 rounded-xl shadow-2xl">
        {phase === 'instructions' ? renderInstructions() : renderGameContent()}
    </div>
  );
};

export default MemoryMatrix;