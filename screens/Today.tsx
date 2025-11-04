import React from 'react';
import { BrainIcon, HeartIcon, LanguageIcon, CalculatorIcon, PlayCircleIcon, ClockIcon, PowerIcon } from '../components/icons';

const WorkoutCard: React.FC<{ title: string, description: string, icon: React.ElementType, color: string }> = ({ title, description, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h4 className="font-bold text-gray-800 text-xl">{title}</h4>
            <p className="text-lg text-gray-500">{description}</p>
        </div>
    </div>
);

const LpiStat: React.FC<{ name: string, score: string, progress: number, color: string }> = ({ name, score, progress, color }) => (
    <div>
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-lg font-semibold text-gray-600">{name}</span>
            <span className="text-lg font-bold text-gray-800">{score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);


const TodayScreen: React.FC = () => {
    return (
        <div className="p-6 lg:p-10 space-y-10 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-800">Good morning, VEERABABU</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Daily Workout */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <BrainIcon className="w-12 h-12 text-orange-500" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-lg text-gray-500">Tuesday, October 14 | 5 games</p>
                            <h2 className="text-3xl font-bold text-gray-800 my-1">Daily Workout</h2>
                            <button className="mt-2 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors text-xl">
                                Begin
                            </button>
                        </div>
                    </div>

                    {/* More Workouts */}
                    <div className="mt-10">
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">More Workouts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <WorkoutCard title="Favorites" description="Treat your brain to the games you play the most." icon={HeartIcon} color="bg-red-500" />
                           <WorkoutCard title="Language" description="Dive deep into your vocabulary and reading skills." icon={LanguageIcon} color="bg-cyan-500" />
                           <WorkoutCard title="Math" description="Challenge your estimation and calculation skills." icon={CalculatorIcon} color="bg-pink-500" />
                           <WorkoutCard title="Strengthen" description="Play your weakest games and raise your low game scores." icon={PlayCircleIcon} color="bg-blue-500" />
                           <WorkoutCard title="Quick" description="Race through short games in 8 minutes or less." icon={ClockIcon} color="bg-green-500" />
                        </div>
                    </div>
                </div>

                {/* CURRENT LPI */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
                        <div className="flex items-center space-x-2 mb-4">
                            <PowerIcon className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-2xl font-bold text-gray-800">CURRENT LPI</h3>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-700 text-xl">Overall LPI</h4>
                            <p className="text-base text-gray-500 mt-1">Your Overall LPI will be available immediately after playing a game from each of the Training Areas below (excluding Math).</p>
                        </div>
                        <div className="space-y-4">
                            <LpiStat name="Speed" score="634" progress={80} color="bg-yellow-400" />
                            <LpiStat name="Memory" score="272" progress={45} color="bg-purple-400" />
                            <LpiStat name="Attention" score="546" progress={70} color="bg-orange-400" />
                            <LpiStat name="Flexibility" score="200" progress={30} color="bg-indigo-400" />
                            <LpiStat name="Problem Solving" score="--" progress={0} color="bg-red-400" />
                             <p className="text-base text-gray-500 pt-2">Math <span className="font-semibold">(Not included in Overall LPI)</span></p>
                            <LpiStat name="Math" score="--" progress={0} color="bg-pink-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodayScreen;