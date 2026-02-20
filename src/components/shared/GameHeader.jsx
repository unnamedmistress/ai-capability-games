import React from 'react';
import { getLessonBySlug } from '../../data/lessons';

export default function GameHeader({ lesson, onBack }) {
  const lessonData = lesson ? getLessonBySlug(lesson.slug) : null;

  return (
    <div className="bg-gray-800/50 border-b border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {lessonData?.icon && (
            <span className="text-2xl">{lessonData.icon}</span>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{lessonData?.title || 'Game'}</h1>
            <p className="text-sm text-gray-400">
              {lessonData?.step || 'Step'} • {lessonData?.layer || 'Layer'}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
