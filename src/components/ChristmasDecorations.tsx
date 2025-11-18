import React from 'react';
import { motion } from 'framer-motion';

interface ChristmasDecorationsProps {
  isActive: boolean;
}

const ChristmasDecorations: React.FC<ChristmasDecorationsProps> = ({ isActive }) => {
  if (!isActive) return null;

  const snowflakes = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-white text-opacity-70 pointer-events-none select-none"
      style={{
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 10 + 10}px`,
      }}
      animate={{
        y: ['0vh', '100vh'],
        rotate: [0, 360],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 3 + 5,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: 'linear',
      }}
    >
      ❄️
    </motion.div>
  ));

  const christmasLights = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute top-0 pointer-events-none select-none"
      style={{
        left: `${(i * 100) / 15}%`,
        color: i % 2 === 0 ? '#ef4444' : '#22c55e',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
      }}
    >
      🔴
    </motion.div>
  ));

  return (
    <>
      {/* Guirlande de lumières en haut */}
      <div className="fixed top-0 left-0 w-full h-6 z-50 overflow-hidden">
        {christmasLights}
      </div>
      
      {/* Flocons de neige */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {snowflakes}
      </div>
      
      {/* Sapin en coin */}
      <motion.div
        className="fixed bottom-4 right-4 text-6xl pointer-events-none select-none z-50"
        animate={{
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🎄
      </motion.div>

      {/* Père Noël en coin gauche */}
      <motion.div
        className="fixed bottom-4 left-4 text-4xl pointer-events-none select-none z-50"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🎅
      </motion.div>
    </>
  );
};

export default ChristmasDecorations;
