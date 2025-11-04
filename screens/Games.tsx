import React, { useState, useMemo } from 'react';
import type { Game } from '../types';
import GameCard from '../components/GameCard';
import { SearchIcon } from '../components/icons';

interface GamesScreenProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const ALL_CATEGORIES = ['All', 'Speed', 'Memory', 'Attention', 'Flexibility', 'Problem Solving', 'Math', 'Language'];

const GamesScreen: React.FC<GamesScreenProps> = ({ games, onSelectGame }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const matchesCategory = activeCategory === 'All' || game.skill === activeCategory;
            const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [games, activeCategory, searchTerm]);

    const groupedGames = useMemo(() => {
        if (activeCategory !== 'All') {
            return { [activeCategory]: filteredGames };
        }
        return filteredGames.reduce((acc, game) => {
            (acc[game.skill] = acc[game.skill] || []).push(game);
            return acc;
        }, {} as Record<Game['skill'], Game[]>);
    }, [filteredGames, activeCategory]);

    return (
        <div className="p-6 lg:p-10 animate-fade-in">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-5xl font-bold text-gray-800">Games</h1>
                    <div className="relative w-full max-w-xs">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                    </div>
                </div>
                <nav className="mt-6 border-b border-gray-200">
                    <ul className="flex space-x-6">
                        {ALL_CATEGORIES.map(category => (
                            <li key={category}>
                                <button
                                    onClick={() => setActiveCategory(category)}
                                    className={`py-3 text-lg font-semibold transition-colors ${
                                        activeCategory === category
                                            ? 'text-orange-500 border-b-2 border-orange-500'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            <div className="space-y-12">
                {Object.entries(groupedGames).map(([skill, gamesInSkill]) => (
                    <section key={skill}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{skill}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
                           {(gamesInSkill as Game[]).map(game => (
                                <GameCard key={game.id} game={game} onSelect={onSelectGame} />
                           ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default GamesScreen;