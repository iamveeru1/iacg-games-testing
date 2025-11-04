import React from 'react';
import { PowerIcon, ChevronDownIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-end">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1 text-orange-500 font-bold text-xl">
            <PowerIcon className="w-5 h-5" />
            <span>0</span>
          </button>
          <div className="flex items-center space-x-1 font-bold text-lg">
            <span className="text-gray-400">---</span>
          </div>
           <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-wider">VEERABABU</span>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;