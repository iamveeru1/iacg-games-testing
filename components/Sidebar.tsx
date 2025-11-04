import React from 'react';
import { BrainIcon, TodayIcon, GamesIcon, MyStatsIcon, InsightsIcon, TestsIcon } from './icons';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
        isActive
          ? 'bg-orange-100 text-orange-600'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'today', label: 'Today', icon: TodayIcon },
    { id: 'games', label: 'Games', icon: GamesIcon },
    { id: 'my-stats', label: 'My Stats', icon: MyStatsIcon },
    { id: 'insights', label: 'Insights', icon: InsightsIcon },
    { id: 'tests', label: 'Tests', icon: TestsIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
      <div className="flex items-center space-x-2 px-2 mb-8">
        <BrainIcon className="h-8 w-8 text-blue-600" />
        <span className="text-3xl font-bold text-gray-800">CogniFlex</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.id}
            onClick={() => setCurrentPage(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;