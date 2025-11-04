import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

const skillColorMap: { [key in Game['skill']]: string } = {
    Memory: 'bg-purple-500',
    Language: 'bg-green-500',
    Attention: 'bg-yellow-500',
    'Problem Solving': 'bg-red-500',
    Speed: 'bg-blue-500',
    Math: 'bg-pink-500',
    Flexibility: 'bg-indigo-500',
};

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const { name, Icon, skill } = game;

  return (
    <div 
        className="text-center cursor-pointer group"
        onClick={() => onSelect(game)}
    >
      <div className={`aspect-video rounded-lg flex items-center justify-center ${skillColorMap[skill]} transform group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="h-16 w-16 text-white/80" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-700 text-xl">{name}</h3>
    </div>
  );
};

export default GameCard;