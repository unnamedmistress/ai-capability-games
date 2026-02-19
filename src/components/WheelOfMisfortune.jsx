import React, { useState, useRef } from 'react'
import { capabilities, categories } from '../data/capabilities'

function WheelOfMisfortune() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const wheelRef = useRef(null)

  const wheelCategories = categories.slice(0, 6)

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setResult(null)
    
    const newRotation = rotation + 1800 + Math.random() * 360
    setRotation(newRotation)
    
    setTimeout(() => {
      setIsSpinning(false)
      const finalAngle = newRotation % 360
      const segmentAngle = 360 / wheelCategories.length
      const selectedIndex = Math.floor((360 - finalAngle + segmentAngle / 2) % 360 / segmentAngle)
      const selectedCategory = wheelCategories[selectedIndex]
      
      const categoryCaps = capabilities.filter(c => c.category === selectedCategory.name)
      const randomCap = categoryCaps[Math.floor(Math.random() * categoryCaps.length)]
      
      setResult({
        category: selectedCategory,
        capability: randomCap || capabilities[Math.floor(Math.random() * capabilities.length)]
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black p-8 font-mono">
      {/* CRT overlay effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-20" style={{
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)'
      }}></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-green-500 mb-4 animate-pulse" style={{
            textShadow: '0 0 10px #22c55e, 0 0 20px #22c55e'
          }}>
            🎰 WHEEL OF MISFORTUNE
          </h1>
          <p className="text-green-400/70 text-lg">Fate chooses your lesson. Adapt or perish.</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Wheel */}
          <div className="relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500"></div>
            </div>
            
            {/* Wheel SVG */}
            <svg
              ref={wheelRef}
              width="350"
              height="350"
              viewBox="0 0 350 350"
              className="transition-transform duration-3000 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <defs>
                {wheelCategories.map((cat, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={cat.color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={cat.color} stopOpacity="0.4" />
                  </linearGradient>
                ))}
              </defs>
              
              <g transform="translate(175, 175)">
                {wheelCategories.map((cat, i) => {
                  const angle = (360 / wheelCategories.length) * i
                  return (
                    <g key={i} transform={`rotate(${angle})`}>
                      <path
                        d="M 0 0 L 150 -50 A 158 158 0 0 1 150 50 Z"
                        fill={`url(#grad${i})`}
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <text
                        x="100"
                        y="5"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="10"
                        fontWeight="bold"
                        transform="rotate(30, 100, 0)"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                      >
                        {cat.name.split(' ')[0]}
                      </text>
                    </g>
                  )
                })}
                
                {/* Center */}
                <circle r="30" fill="#000" stroke="#22c55e" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="16">SPIN</text>
              </g>
            </svg>
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-black font-bold text-xl rounded border-2 border-green-400 transition-all transform hover:scale-105 active:scale-95"
            style={{
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(0,0,0,0.3)',
              textShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
          </button>

          {/* Result */}
          {result && (
            <div className="w-full max-w-md bg-green-900/30 border-2 border-green-500 rounded-lg p-6 text-center">
              <div className="text-green-400 text-sm mb-2">FATE HAS SPOKEN</div>
              <div className="text-4xl mb-4">{result.capability.icon}</div>
              <h3 className="text-2xl font-bold text-green-300 mb-2">{result.capability.name}</h3>
              <p className="text-green-200/70 mb-4">{result.capability.description}</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-green-800/50 rounded text-green-300">{result.category.name}</span>
                <span className="px-3 py-1 bg-green-700/50 rounded text-green-200">{result.capability.level}</span>
              </div>
              <div className="mt-4 text-xs text-green-400/50">
                "The wheel is rigged. You cannot escape your destiny."
              </div>
            </div>
          )}

          {/* Instructions */}
          {!result && !isSpinning && (
            <div className="text-center text-green-600/50 text-sm max-w-md">
              <p>The wheel knows what you need to learn.</p>
              <p>Resistance is futile. Spin to discover your fate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WheelOfMisfortune
