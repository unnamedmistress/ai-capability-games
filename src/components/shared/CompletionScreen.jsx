import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSONS } from '../../data/lessons';

export default function CompletionScreen({ lesson, xpEarned, perfect, onNext, onReplay }) {
  const navigate = useNavigate();
  
  // Find current lesson index and next lesson
  const currentIndex = LESSONS.findIndex(l => l.slug === lesson.slug);
  const nextLesson = LESSONS[currentIndex + 1];
  const isLastLesson = !nextLesson;

  const handleContinue = () => {
    if (onNext) {
      onNext(xpEarned);
    }
  };

  const handleBackToLessons = () => {
    navigate('/lessons');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 rounded-2xl border border-gray-700 p-8 text-center">
        {/* Success Animation */}
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {perfect ? '🏆' : '✨'}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Lesson Complete!
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl">
            <span className="text-yellow-400 font-bold">+{xpEarned} XP</span>
            {perfect && (
              <span className="text-green-400 text-sm bg-green-900/30 px-2 py-1 rounded-full">
                Perfect! 🌟
              </span>
            )}
          </div>
        </div>

        {/* Metacognition Section */}
        <div className="bg-blue-900/20 rounded-xl p-4 mb-4 border border-blue-500/30">
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">
            💭 Metacognition
          </h2>
          <p className="text-gray-300 text-sm">{lesson.metacognition}</p>
        </div>

        {/* Pitfall Section */}
        <div className="bg-red-900/20 rounded-xl p-4 mb-6 border border-red-500/30">
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">
            ⚠️ Pitfall to Avoid
          </h2>
          <p className="text-gray-300 text-sm">{lesson.pitfall}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/50"
          >
            {isLastLesson ? 'Finish Course 🎓' : `Next: ${nextLesson.title} →`}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onReplay}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors"
            >
              🔄 Replay
            </button>
            <button
              onClick={handleBackToLessons}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors"
            >
              📚 All Lessons
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Lesson {currentIndex + 1} of {LESSONS.length} complete
          </p>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${((currentIndex + 1) / LESSONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
