import React from 'react'
import { Link } from 'react-router-dom'

function Navigation({ progress, level, completedCount }) {
  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎮 AI Capability Games
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/lessons" className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              📚 Lessons
            </Link>
            <Link to="/labyrinth" className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              🪞 Labyrinth
            </Link>
            <Link to="/codex" className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              📖 Codex
            </Link>
            <Link to="/progressorium" className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              ⚙️ Progress
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:block text-right">
              <p className="text-yellow-400 font-bold">⭐ {progress || 0} XP</p>
              <p className="text-gray-500">Level {level || 1}</p>
            </div>
            <div className="bg-gray-800 rounded-lg px-3 py-1">
              <span className="text-blue-400 font-bold">{completedCount || 0}</span>
              <span className="text-gray-500 text-xs">/20</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
