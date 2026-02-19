import React from 'react'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="bg-dark/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Capability Games
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/labyrinth" className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              🪞 Labyrinth
            </Link>
            <Link to="/codex" className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              📖 Codex
            </Link>
            <Link to="/progressorium" className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              ⚙️ Progressorium
            </Link>
            <Link to="/wheel" className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
              🎰 Wheel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
