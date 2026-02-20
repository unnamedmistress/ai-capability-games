import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useProgress } from './hooks/useProgress'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import LessonBrowser from './components/LessonBrowser'
import Labyrinth from './components/Labyrinth'
import CelestialCodex from './components/CelestialCodex'
import Progressorium from './components/Progressorium'
import WheelOfMisfortune from './components/WheelOfMisfortune'
import LessonRouter from './components/LessonRouter'

function App() {
  const { progress, level, completedCount, progressPercent, completeLesson, hasCompleted } = useProgress()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation progress={progress} level={level} completedCount={completedCount} />
      <Routes>
        <Route path="/" element={
          <Hero 
            progress={progress} 
            level={level} 
            completedCount={completedCount} 
            progressPercent={progressPercent}
            hasCompleted={hasCompleted}
          />
        } />
        <Route path="/lessons" element={<LessonBrowser />} />
        <Route path="/labyrinth" element={<Labyrinth />} />
        <Route path="/codex" element={<CelestialCodex />} />
        <Route path="/progressorium" element={<Progressorium />} />
        <Route path="/wheel" element={<WheelOfMisfortune />} />
        <Route path="/lesson/:slug" element={<LessonRouter onComplete={completeLesson} />} />
      </Routes>
    </div>
  )
}

export default App
