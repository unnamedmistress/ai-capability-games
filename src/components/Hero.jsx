import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  const games = [
    {
      title: "🪞 Labyrinth of Mirrors",
      desc: "Navigate a shifting decision tree where each mirror reveals an AI capability",
      path: "/labyrinth",
      color: "from-pink-500 to-purple-600"
    },
    {
      title: "📖 Celestial Codex",
      desc: "Draw constellations to summon AI spirits and unlock capabilities",
      path: "/codex",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "⚙️ Progressorium",
      desc: "Tend a steampunk garden of gear-plants representing your skills",
      path: "/progressorium",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "🎰 Wheel of Misfortune",
      desc: "Fate chooses your lesson. Adapt or perish (metaphorically)",
      path: "/wheel",
      color: "from-green-500 to-emerald-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-secondary to-accent opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                AI Capability Atlas
              </span>
              <br />
              <span className="text-white">Learning Games</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Five archetypes. One vision. Discover 71 AI capabilities through play.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['🧙 Wizard', '⚙️ Engineer', '🃏 Trickster', '📚 Sage', '🎨 Artist'].map((badge) => (
                <span key={badge} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Choose Your Game</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <Link
              key={game.path}
              to={game.path}
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative bg-dark/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-400">{game.desc}</p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  Play Now
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero
