import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import { getLessonBySlug } from '../../data/lessons';

export default function LessonCard({ slug }) {
  const { completed } = useProgress();
  const lesson = getLessonBySlug(slug);
  const isCompleted = completed.includes(lesson.id);

  return (
    <div className={`relative rounded-xl p-6 border-2 ${isCompleted ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-800/50'} hover:border-purple-400 transition-colors`}>
      <div className="flex items-start gap-4">
        <div className={`text-3xl p-3 rounded-lg ${isCompleted ? 'bg-purple-500' : 'bg-gray-700'}`}>
          {lesson.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{lesson.title}</h3>
          <p className="text-gray-400 mb-3">{lesson.step}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${isCompleted ? 'bg-purple-900 text-purple-300' : 'bg-gray-700 text-gray-400'}`}>
              {lesson.layer}
            </span>
            <span className="text-purple-400">{lesson.xp} XP</span>
            {isCompleted && (
              <span className="ml-auto text-green-400">✓ Completed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}