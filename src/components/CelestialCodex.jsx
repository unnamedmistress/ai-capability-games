import React, { useEffect, useRef, useState } from 'react'
import { capabilities } from '../data/capabilities'

function CelestialCodex() {
  const canvasRef = useRef(null)
  const [stars, setStars] = useState([])
  const [connections, setConnections] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startStar, setStartStar] = useState(null)
  const [unlockedCapabilities, setUnlockedCapabilities] = useState([])
  const [currentCap, setCurrentCap] = useState(null)

  useEffect(() => {
    // Generate stars based on capabilities
    const newStars = capabilities.slice(0, 15).map((cap, i) => ({
      id: i,
      x: 100 + (i % 5) * 120 + Math.random() * 40,
      y: 80 + Math.floor(i / 5) * 100 + Math.random() * 40,
      capability: cap,
      glow: 0
    }))
    setStars(newStars)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background stars
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw connections
    connections.forEach(([start, end]) => {
      ctx.strokeStyle = '#e94560'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    })

    // Draw stars
    stars.forEach(star => {
      const isUnlocked = unlockedCapabilities.includes(star.capability.id)
      
      // Glow effect
      if (isUnlocked) {
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 30)
        gradient.addColorStop(0, 'rgba(233, 69, 96, 0.5)')
        gradient.addColorStop(1, 'rgba(233, 69, 96, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      // Star
      ctx.fillStyle = isUnlocked ? '#e94560' : '#533483'
      ctx.beginPath()
      ctx.arc(star.x, star.y, isUnlocked ? 12 : 8, 0, Math.PI * 2)
      ctx.fill()

      // Star sparkle
      ctx.strokeStyle = isUnlocked ? '#fff' : '#7c3aed'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(star.x - 15, star.y)
      ctx.lineTo(star.x + 15, star.y)
      ctx.moveTo(star.x, star.y - 15)
      ctx.lineTo(star.x, star.y + 15)
      ctx.stroke()
    })
  }, [stars, connections, unlockedCapabilities])

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedStar = stars.find(star => {
      const dist = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2)
      return dist < 20
    })

    if (clickedStar) {
      setIsDrawing(true)
      setStartStar(clickedStar)
    }
  }

  const handleMouseUp = (e) => {
    if (!isDrawing || !startStar) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const endStar = stars.find(star => {
      const dist = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2)
      return dist < 20 && star.id !== startStar.id
    })

    if (endStar) {
      const newConnection = [startStar, endStar]
      setConnections([...connections, newConnection])
      
      // Unlock capability when 3+ connections
      if (connections.length >= 2 && !unlockedCapabilities.includes(endStar.capability.id)) {
        setUnlockedCapabilities([...unlockedCapabilities, endStar.capability.id])
        setCurrentCap(endStar.capability)
      }
    }

    setIsDrawing(false)
    setStartStar(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-accent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📖 Celestial Codex</h1>
          <p className="text-gray-300">Draw lines between stars to form constellations and unlock AI spirits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <canvas
              ref={canvasRef}
              width={700}
              height={400}
              className="w-full bg-dark/80 rounded-2xl border border-white/10 cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />
            <p className="text-center text-gray-400 mt-4">Click and drag from star to star to draw connections</p>
          </div>

          <div className="space-y-4">
            {currentCap ? (
              <div className="bg-dark/50 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl text-center mb-4">{currentCap.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{currentCap.name}</h3>
                <p className="text-gray-300 mb-4">{currentCap.description}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">{currentCap.category}</span>
                  <span className="px-3 py-1 bg-primary/30 rounded-full text-sm">{currentCap.level}</span>
                </div>
              </div>
            ) : (
              <div className="bg-dark/50 rounded-2xl p-6 border border-white/10 text-center text-gray-400">
                <div className="text-6xl mb-4">✨</div>
                <p>Create 3+ connections to summon an AI spirit</p>
              </div>
            )}

            <div className="bg-dark/50 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Connections</span>
                  <span className="text-primary">{connections.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Spirits Summoned</span>
                  <span className="text-primary">{unlockedCapabilities.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelestialCodex
