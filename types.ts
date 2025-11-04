import type React from 'react';

export interface Game {
  id: string;
  name: string;
  description: string;
  skill: 'Memory' | 'Language' | 'Attention' | 'Problem Solving' | 'Speed' | 'Flexibility' | 'Math';
  component: React.FC<{ onExit: () => void }>;
  Icon: React.FC<{ className?: string }>;
  isFullScreen?: boolean;
}

export interface GameComponentProps {
    onExit: () => void;
}
