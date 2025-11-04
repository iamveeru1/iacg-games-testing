
import React from 'react';

interface GameContainerProps {
  title: string;
  onExit: () => void;
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ title, onExit, children }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">{title}</h2>
        <button
          onClick={onExit}
          className="bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          &larr; Back to Games
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default GameContainer;