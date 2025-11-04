import React from 'react';

interface TestingUnityGameProps {
  onExit: () => void;
}

const TestingUnityGame: React.FC<TestingUnityGameProps> = ({ onExit }) => {
  return (
    <iframe
      src="https://amphibiously-fusiform-madilynn.ngrok-free.dev/"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    ></iframe>
  );
};

export default TestingUnityGame;