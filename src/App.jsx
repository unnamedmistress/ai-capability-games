import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Labyrinth from './components/Labyrinth'
import CelestialCodex from './components/CelestialCodex'
import Progressorium from './components/Progressorium'
import WheelOfMisfortune from './components/WheelOfMisfortune'

function App() {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/labyrinth" element={<Labyrinth />} />
        <Route path="/codex" element={<CelestialCodex />} />
        <Route path="/progressorium" element={<Progressorium />} />
        <Route path="/wheel" element={<WheelOfMisfortune />} />
      </Routes>
    </div>
  )
}

export default App
