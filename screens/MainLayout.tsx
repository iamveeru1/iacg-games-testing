import React, { useState } from 'react';
import MemoryMatrix from '../games/MemoryMatrix';
import WordSnatchers from '../games/WordSnatchers';
import ColorMatch from '../games/ColorMatch';
import FuseClues from '../games/FuseClues';
import TestingUnityGame from '../games/testingUnityGame';
import type { Game } from '../types';
import { ExitIcon, QuestionMarkIcon, SquareIcon, DropletIcon, MemoryIcon, LanguageIcon, AttentionIcon, ProblemSolvingIcon, SpeedIcon, MathIcon, FlexibilityIcon, ChevronDownIcon, TodayIcon, GamesIcon, MyStatsIcon, InsightsIcon, TestsIcon } from '../components/icons';
import TodayScreen from './Today';
import GamesScreen from './Games';

// My Stats Screen Component
const MyStatsScreen: React.FC<{ games: Game[] }> = ({ games }) => {
    // Mock stats data matching the screenshot layout
    const statsData = {
        cognitivePerformance: [
            { name: 'Overall CPI', score: 1299, max: 2000 },
            { name: 'Speed', score: 1719, max: 2000 },
            { name: 'Memory', score: 1456, max: 2000 },
            { name: 'Attention', score: 1600, max: 2000 },
            { name: 'Flexibility', score: 1289, max: 2000 },
            { name: 'Problem Solving', score: 871, max: 2000 },
            { name: 'Math', score: 713, max: 2000 },
        ],
        comparison: [
            { name: 'Overall', percentage: 81 },
            { name: 'Speed', percentage: 65.7 },
            { name: 'Problem Solving', percentage: 57.8 },
            { name: 'Memory', percentage: 88.3 },
            { name: 'Attention', percentage: 86.2 },
            { name: 'Flexibility', percentage: 76.4 },
            { name: 'Math', percentage: 36 },
        ],
        mostImprovedGames: [
            { name: 'assist ants', improvement: '+2.1%', color: 'bg-red-500' },
            { name: 'skyrise', improvement: '+1.8%', color: 'bg-blue-500' },
            { name: 'cognition kitchen', improvement: '+0.9%', color: 'bg-green-500' },
        ],
        gameRankings: [
            { rank: 1, name: 'cognition kitchen', score: 1774, color: 'bg-blue-500' },
            { rank: 2, name: 'assist ants', score: 1667, color: 'bg-red-500' },
            { rank: 3, name: 'skyrise', score: 1528, color: 'bg-blue-500' },
        ],
        trainingStreak: {
            percentage: 23,
            daysPlayed: 5,
            daysMissed: 1,
            daysRemaining: 16,
            currentStreak: 3,
            bestStreak: 6,
        }
    };



    // Generate calendar days for October 2025
    const generateCalendarDays = () => {
        const days = [];
        const today = 21; // October 21, 2025
        const daysInMonth = 31;
        
        for (let day = 1; day <= daysInMonth; day++) {
            let status = 'future';
            if (day <= statsData.trainingStreak.daysPlayed) {
                status = 'completed';
            } else if (day === statsData.trainingStreak.daysPlayed + 1) {
                status = 'missed';
            } else if (day === today) {
                status = 'today';
            }
            days.push({ day, status });
        }
        return days;
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
            <div className="w-full h-full">
                <h1 className="text-3xl font-bold text-gray-900 p-6 pb-0">My Statistics</h1>
                
                <div className="h-full p-6">
                    {/* First Row: COGNITIVE PERFORMANCE INDEX (30%) and TRAINING STREAKS (70%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-1/2 mb-4">
                        {/* Cognitive Performance Index - 30% width */}
                        <div className="lg:col-span-3 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-sm font-bold text-gray-600 tracking-wider">COGNITIVE PERFORMANCE INDEX</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {statsData.cognitivePerformance.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                                style={{ width: `${(item.score / item.max) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>First CPI</span>
                                <span>Best CPI</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-2xl font-bold text-gray-900">674</span>
                                <span className="text-2xl font-bold text-yellow-500">1305</span>
                            </div>
                        </div>
                    </div>

                        {/* Training Streaks - 70% width */}
                        <div className="lg:col-span-7 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <h2 className="text-sm font-bold text-gray-600 tracking-wider">TRAINING STREAKS</h2>
                            </div>
                            
                            {/* Top Section - All Stats and Info */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                {/* Left - Month Navigation and Progress */}
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div className="text-lg font-semibold text-gray-900">October 2025</div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-bold text-gray-900">{statsData.trainingStreak.percentage}%</div>
                                        <div className="text-sm text-gray-600">complete</div>
                                    </div>
                                </div>

                                {/* Right - Stats */}
                                <div className="flex items-center gap-8 text-sm">
                                    <div className="text-green-600 font-medium">{statsData.trainingStreak.daysPlayed} days played</div>
                                    <div className="text-red-600 font-medium">{statsData.trainingStreak.daysMissed} days missed</div>
                                    <div className="text-gray-600">{statsData.trainingStreak.daysRemaining} days remaining</div>
                                    <div className="text-blue-600 font-medium">3 day current streak</div>
                                    <div className="text-purple-600 font-medium">6 day best streak</div>
                                </div>
                            </div>

                            {/* Bottom Section - Calendar */}
                            <div className="flex-1">
                                <div className="grid grid-cols-7 gap-2 h-full">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-gray-500 font-medium py-2 text-sm">{day}</div>
                                    ))}
                                    {calendarDays.map(({ day, status }) => (
                                        <div key={day} className={`w-full h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                                            ${status === 'completed' ? 'bg-yellow-400 text-black' : 
                                              status === 'missed' ? 'bg-red-500 text-white' :
                                              status === 'today' ? 'bg-blue-500 text-white ring-2 ring-blue-300' :
                                              'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                        `}>
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Row: HOW I COMPARE (30%), MOST IMPROVED GAMES (35%), and GAME RANKINGS (35%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-20 gap-4 h-1/2">
                        {/* How I Compare - 30% width (6 columns out of 20) */}
                        <div className="lg:col-span-6 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <h2 className="text-sm font-bold text-gray-600 tracking-wider">HOW I COMPARE</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {statsData.comparison.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Improved Games - 35% width (7 columns out of 20) */}
                        <div className="lg:col-span-7 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <h2 className="text-sm font-bold text-gray-600 tracking-wider">MOST IMPROVED GAMES</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {statsData.mostImprovedGames.map((game, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${game.color} rounded-full flex items-center justify-center text-white text-lg`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">{game.name}</div>
                                            <div className="text-xs text-green-600 font-medium">{game.improvement}</div>
                                        </div>
                                        <div className="text-green-500">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="text-yellow-600 text-sm font-medium mt-4 hover:text-yellow-700 transition-colors">
                                VIEW ALL →
                            </button>
                        </div>

                        {/* Game Rankings - 35% width (7 columns out of 20) */}
                        <div className="lg:col-span-7 bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <h2 className="text-sm font-bold text-gray-600 tracking-wider">GAME RANKINGS</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {statsData.gameRankings.map((game, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-gray-900 w-6">{game.rank}</span>
                                            <div className={`w-8 h-8 ${game.color} rounded-full flex items-center justify-center text-white text-sm`}>
                                                {game.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{game.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{game.score}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="text-yellow-600 text-sm font-medium mt-4 hover:text-yellow-700 transition-colors">
                                VIEW ALL →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const games: Game[] = [
  {
    id: 'word-snatchers',
    name: 'Word Snatchers',
    description: 'Exercise your vocabulary by unscrambling the letters to form a word based on the hint.',
    skill: 'Language',
    component: WordSnatchers,
    Icon: LanguageIcon,
    isFullScreen: false,
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Test your spatial recall by memorizing and recreating patterns of tiles on a grid.',
    skill: 'Memory',
    component: MemoryMatrix,
    Icon: MemoryIcon,
  },
  {
    id: 'color-match',
    name: 'Color Match',
    description: 'Test your attention by checking if the meaning of one word matches the text color of another.',
    skill: 'Attention',
    component: ColorMatch,
    Icon: AttentionIcon,
  },
  {
    id: 'fuse-clues',
    name: 'Fuse Clues',
    description: 'Arrange the numbers on the fuse line to form a complete, correctly ordered sequence.',
    skill: 'Problem Solving',
    component: FuseClues,
    Icon: ProblemSolvingIcon,
  },
  {
    id: 'testing-unity-game',
    name: 'Testing Unity Game',
    description: 'A test for integrating Unity games.',
    skill: 'Problem Solving',
    component: TestingUnityGame,
    Icon: ProblemSolvingIcon,
    isFullScreen: true, // Important for iframe
  },
   // Adding placeholder games for other categories to flesh out the UI
  {
    id: 'speed-match',
    name: 'Speed Match',
    description: 'Quickly match shapes before they disappear.',
    skill: 'Speed',
    component: ColorMatch, // Using an existing component as a placeholder
    Icon: SpeedIcon,
  },
  {
    id: 'calculation-course',
    name: 'Calculation Course',
    description: 'Solve arithmetic problems against the clock.',
    skill: 'Math',
    component: FuseClues, // Using an existing component as a placeholder
    Icon: MathIcon,
  },
  {
    id: 'flexible-thinking',
    name: 'Flexible Thinking',
    description: 'Adapt to changing rules in this cognitive flexibility challenge.',
    skill: 'Flexibility',
    component: MemoryMatrix, // Using an existing component as a placeholder
    Icon: FlexibilityIcon,
  },
];


const MainLayout: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [currentPage, setCurrentPage] = useState('today');

  const handleExitGame = () => {
    setActiveGame(null);
  };

  if (activeGame) {
    const GameComponent = activeGame.component;
    if (activeGame.isFullScreen) {
        return (
            <div className="w-full h-screen font-sans bg-gray-900 flex items-center justify-center">
                <GameComponent onExit={handleExitGame} />
            </div>
        );
    }
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
         <header className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                      <button onClick={handleExitGame} className="flex items-center space-x-2 text-lg font-semibold hover:text-blue-600 transition-colors">
                          <ExitIcon className="w-5 h-5"/>
                          <span>QUIT GAME</span>
                      </button>
                       <button className="flex items-center space-x-2 text-lg font-semibold hover:text-blue-600 transition-colors">
                          <QuestionMarkIcon className="w-5 h-5"/>
                          <span>HOW TO PLAY</span>
                      </button>
                  </div>
                   <div className="flex items-center space-x-4 text-sm font-semibold text-gray-500">
                      <span>GAME SETTINGS:</span>
                      <button className="hover:text-blue-600 transition-colors text-gray-800"><SquareIcon className="w-6 h-6"/></button>
                      <button className="hover:text-blue-600 transition-colors text-gray-800"><DropletIcon className="w-6 h-6"/></button>
                   </div>
              </div>
          </header>
          <main className="flex-grow">
              <GameComponent onExit={handleExitGame} />
          </main>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
        case 'today':
            return <TodayScreen />;
        case 'games':
            return <GamesScreen games={games} onSelectGame={setActiveGame} />;
        case 'my-stats':
            return <MyStatsScreen games={games} />;
        case 'insights':
            return <div className="text-5xl font-bold p-10">Insights (Coming Soon)</div>;
        case 'tests':
            return <div className="text-5xl font-bold p-10">Tests (Coming Soon)</div>;
        default:
            return <TodayScreen />;
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col text-gray-800 font-sans">
        {/* Fixed Header spanning full width */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Left side - Logo */}
            <div className="flex items-center space-x-2">
                <span className="text-2xl font-normal text-gray-800" style={{ fontWeight: '400' }}>lumosity</span>
            </div>
            
            {/* Right side - User info */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-orange-500 font-semibold text-base">
                    <span className="text-lg">🔥</span>
                    <span>3</span>
                </div>
                <div className="flex items-center space-x-2 text-yellow-500 font-semibold text-base">
                    <span className="text-lg">⚡</span>
                    <span>963</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-base tracking-wide text-gray-800">VEERABABU</span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </header>

        {/* Main content area below header */}
        <div className="flex flex-1 overflow-hidden">
            {/* Fixed Sidebar */}
            <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <nav className="flex-1">
                    {[

                        { id: 'today', label: 'Today', icon: <TodayIcon className="w-6 h-6" /> },
                        { id: 'games', label: 'Games', icon: <GamesIcon className="w-6 h-6" /> },
                        { id: 'my-stats', label: 'My Stats', icon: <MyStatsIcon className="w-6 h-6" /> },
                        { id: 'insights', label: 'Insights', icon: <InsightsIcon className="w-6 h-6" /> },
                        { id: 'tests', label: 'Tests', icon: <TestsIcon className="w-6 h-6" /> },
                    ].map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`flex items-center w-full px-8 py-5 text-left border-b border-gray-100 transition-colors ${
                                currentPage === item.id
                                    ? 'bg-orange-50 text-orange-600 border-l-4 border-l-orange-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        >
                            <span className="mr-4 flex-shrink-0">{item.icon}</span>
                            <span className="text-lg font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto bg-white">
                {renderPage()}
            </main>
        </div>
    </div>
  );
};

export default MainLayout;