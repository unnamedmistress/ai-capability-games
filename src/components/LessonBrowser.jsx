import React from 'react';
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

function LessonCard({ lesson }) {
  return (
    <Link
      to={`/lesson/${lesson.slug}`}
      className="block bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all hover:transform hover:scale-[1.02] group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{lesson.icon}</span>
        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${layerColors[lesson.layer]} text-white font-bold`}>
          {lesson.layer}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {lesson.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {lesson.objective}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Step {lesson.id}</span>
        <span className="text-yellow-400">⭐ {lesson.xp} XP</span>
      </div>
    </Link>
  );
}

function LayerSection({ layer, lessons }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{layerIcons[layer]}</span>
        <h2 className="text-2xl font-bold text-white">{layer} Layer</h2>
        <span className="text-gray-500 text-sm">({lessons.length} lessons)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}

export default function LessonBrowser() {
  const layers = [...new Set(LESSONS.map(l => l.layer))];
  
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎮 AI Capability Games
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master AI collaboration through 20 interactive micro-lessons. 
            Progress from Foundation skills to advanced Strategy.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800/30 rounded-2xl p-6 mb-10 border border-gray-700">
          <div className="flex flex-wrap justify-center gap-8">
            {layers.map(layer => {
              const count = LESSONS.filter(l => l.layer === layer).length;
              return (
                <div key={layer} className="text-center">
                  <span className="text-3xl">{layerIcons[layer]}</span>
                  <p className="text-white font-bold">{layer}</p>
                  <p className="text-gray-500 text-sm">{count} lessons</p>
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
        </div>

        {/* Lessons by Layer */}
        {layers.map(layer => (
          <LayerSection 
            key={layer} 
            layer={layer} 
            lessons={LESSONS.filter(l => l.layer === layer)} 
          />
        ))}
      </div>
    </div>
  );
}
