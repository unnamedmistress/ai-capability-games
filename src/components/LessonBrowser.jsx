import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../data/lessons';

const layerColors = {
  'Foundation': 'from-blue-600 to-indigo-600',
  'Synthesis': 'from-purple-600 to-pink-600',
  'Creation': 'from-pink-600 to-rose-600',
  'Strategy': 'from-orange-600 to-amber-600'
};

const layerIcons = {
  'Foundation': '🧱',
  'Synthesis': '🔗',
  'Creation': '✨',
  'Strategy': '🎯'
};

const difficultyIcons = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴'
};

function getDifficulty(lesson) {
  if (lesson.layer === 'Foundation') return { level: 'easy', label: 'Beginner', time: '5-8 min' };
  if (lesson.layer === 'Synthesis') return { level: 'medium', label: 'Intermediate', time: '8-12 min' };
  if (lesson.layer === 'Creation') return { level: 'medium', label: 'Intermediate', time: '10-15 min' };
  return { level: 'hard', label: 'Advanced', time: '12-20 min' };
}

function LessonCard({ lesson }) {
  const [showDetails, setShowDetails] = useState(false);
  const difficulty = getDifficulty(lesson);
  
  return (
    <div 
      className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all group shadow-lg hover:shadow-xl"
      role="article"
      aria-label={`${lesson.title} - ${difficulty.label} difficulty`}
    >
      <Link 
        to={`/lesson/${lesson.slug}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg"
        aria-label={`Start ${lesson.title}`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl" role="img" aria-label={lesson.title}>
            {lesson.icon}
          </span>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${layerColors[lesson.layer]} text-white font-bold`}>
              {lesson.layer}
            </span>
            <span className="text-xs text-gray-400" title="Estimated time">
              ⏱️ {difficulty.time}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {lesson.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs" title={`Difficulty: ${difficulty.label}`}>
            {difficultyIcons[difficulty.level]} {difficulty.label}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-yellow-400 text-xs font-bold">⭐ {lesson.xp} XP</span>
        </div>
        
        <p className="text-gray-300 text-sm mb-3">
          {lesson.objective}
        </p>
      </Link>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 w-full min-h-[44px] py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-expanded={showDetails}
          aria-label={showDetails ? 'Hide lesson details' : 'Show lesson details'}
        >
          <span>{showDetails ? '▼' : '▶'}</span>
          <span>{showDetails ? 'Hide details' : 'Show what you\'ll learn'}</span>
        </button>
        
        {showDetails && (
          <div className="mt-3 space-y-3 text-sm animate-fadeIn">
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
              <p className="text-blue-300 font-medium mb-1">📚 Learning Goal:</p>
              <p className="text-gray-300">{lesson.step}</p>
            </div>
            
            <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-500/20">
              <p className="text-amber-300 font-medium mb-1">⚠️ Avoid This:</p>
              <p className="text-gray-300">{lesson.pitfall}</p>
            </div>
            
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
              <p className="text-purple-300 font-medium mb-1">🎯 Challenge Levels:</p>
              <div className="space-y-1 text-gray-400 text-xs">
                <p>🟢 Easy: {lesson.zpd.easy}</p>
                <p>🟡 Medium: {lesson.zpd.medium}</p>
                <p>🔴 Hard: {lesson.zpd.hard}</p>
              </div>
            </div>
            
            <Link
              to={`/lesson/${lesson.slug}`}
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-center text-white font-bold transition-all min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={`Start ${lesson.title} lesson`}
            >
              Start Lesson →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function LayerSection({ layer, lessons }) {
  return (
    <section className="mb-10" aria-labelledby={`${layer.toLowerCase()}-heading`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" role="img" aria-label={`${layer} layer`}>
          {layerIcons[layer]}
        </span>
        <h2 id={`${layer.toLowerCase()}-heading`} className="text-2xl font-bold text-white">
          {layer} Layer
        </h2>
        <span className="text-gray-400 text-sm">({lessons.length} lessons)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

export default function LessonBrowser() {
  const layers = [...new Set(LESSONS.map(l => l.layer))];
  
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎮 AI Capability Games
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Master AI collaboration through 20 interactive micro-lessons. 
            Progress from Foundation skills to advanced Strategy.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>🟢 Beginner (5-8 min)</span>
            <span>🟡 Intermediate (8-15 min)</span>
            <span>🔴 Advanced (12-20 min)</span>
          </div>
        </header>

        <section className="bg-gray-800/30 rounded-2xl p-6 mb-10 border border-gray-700" aria-label="Course overview">
          <div className="flex flex-wrap justify-center gap-8">
            {layers.map(layer => {
              const count = LESSONS.filter(l => l.layer === layer).length;
              return (
                <div key={layer} className="text-center">
                  <span className="text-3xl" role="img" aria-label={layer}>
                    {layerIcons[layer]}
                  </span>
                  <p className="text-white font-bold">{layer}</p>
                  <p className="text-gray-400 text-sm">{count} lessons</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Total: <span className="text-white font-bold">{LESSONS.length}</span> lessons • 
              <span className="text-yellow-400 font-bold"> {LESSONS.reduce((acc, l) => acc + l.xp, 0)}</span> XP available
            </p>
          </div>
        </section>

        <main>
          {layers.map(layer => (
            <LayerSection 
              key={layer} 
              layer={layer} 
              lessons={LESSONS.filter(l => l.layer === layer)} 
            />
          ))}
        </main>
      </div>
    </div>
  );
}
