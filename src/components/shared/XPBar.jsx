import React from 'react';
import { useProgress } from '../../hooks/useProgress';

export default function XPBar() {
  const { xp, level } = useProgress();
  const xpNeeded = level * 100;
  const progress = Math.min(100, (xp / xpNeeded) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 h-2 z-50">
      <div 
        className="h-full bg-purple-500 transition-all duration-300" 
        style={{ width: `${progress}%` }}
      />
      <div className="absolute top-2 right-4 text-xs text-gray-400">
        Level {level} • {xp}/{xpNeeded} XP
      </div>
    </div>
  );
}