import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ progress, level, completedCount, progressPercent, hasCompleted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          AI Capability
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {' '}Games
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Master the art of working with AI through 20 interactive micro-lessons. 
          Build skills from Foundation to Strategy.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-3xl font-bold text-white">20</p>
            <p className="text-gray-400 text-sm">Micro-Lessons</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-3xl font-bold text-blue-400">{completedCount || 0}</p>
            <p className="text-gray-400 text-sm">Completed</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-3xl font-bold text-purple-400">{level || 1}</p>
            <p className="text-gray-400 text-sm">Current Level</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-3xl font-bold text-yellow-400">{progress || 0}</p>
            <p className="text-gray-400 text-sm">Total XP</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/lessons"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white hover:opacity-90 transition-all transform hover:scale-105"
          >
            🎮 Start Learning
          </Link>
          <Link
            to="/labyrinth"
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-all"
          >
            🪞 Explore Labyrinth
          </Link>
        </div>

        {/* Quick Progress */}
        {progressPercent > 0 && (
          <div className="mt-10 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Your Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
