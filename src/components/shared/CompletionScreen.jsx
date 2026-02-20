import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { LESSONS } from '../../data/lessons';

export default function CompletionScreen({ lesson, xpEarned, perfect, onNext, onReplay }) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Find current lesson index and next lesson
  const currentIndex = LESSONS.findIndex(l => l.slug === lesson.slug);
  const nextLesson = LESSONS[currentIndex + 1];
  const isLastLesson = !nextLesson;
  const progressPercent = ((currentIndex + 1) / LESSONS.length) * 100;

  // Trigger confetti on mount if perfect score
  useEffect(() => {
    if (perfect && !showConfetti) {
      setShowConfetti(true);
      
      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#fbbf24', '#34d399']
      });

      // Second burst after delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#ec4899', '#fbbf24']
        });
      }, 200);

      // Third burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#a855f7', '#ec4899', '#fbbf24', '#34d399']
        });
      }, 400);
    }
  }, [perfect, showConfetti]);

  const handleContinue = () => {
    if (onNext) {
      onNext(xpEarned);
    }
  };

  const handleBackToLessons = () => {
    navigate('/lessons');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-md w-full bg-gray-800/50 rounded-2xl border border-gray-700 p-8 text-center shadow-2xl">
        {/* Success Animation */}
        <div className="mb-6">
          <div className={`text-6xl mb-4 ${perfect ? 'animate-bounce' : 'animate-pulse'}`}>
            {perfect ? '🏆' : '✨'}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Lesson Complete!
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl">
            <span className="text-yellow-400 font-bold">+{xpEarned} XP</span>
            {perfect && (
              <span className="text-green-400 text-sm bg-green-900/30 px-3 py-1 rounded-full animate-pulse">
                Perfect! 🌟
              </span>
            )}
          </div>
        </div>

        {/* Metacognition Section */}
        <div className="bg-blue-900/20 rounded-xl p-6 mb-4 border border-blue-500/30">
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">
            💭 Metacognition
          </h2>
          <p className="text-gray-300 text-sm">{lesson.metacognition}</p>
        </div>

        {/* Pitfall Section */}
        <div className="bg-red-900/20 rounded-xl p-6 mb-6 border border-red-500/30">
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">
            ⚠️ Pitfall to Avoid
          </h2>
          <p className="text-gray-300 text-sm">{lesson.pitfall}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/50 min-h-[56px]"
          >
            {isLastLesson ? '🎓 Finish Course' : `Next: ${nextLesson.title} →`}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onReplay}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors min-h-[48px]"
            >
              🔄 Replay
            </button>
            <button
              onClick={handleBackToLessons}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors min-h-[48px]"
            >
              📚 All Lessons
            </button>
          </div>
        </div>

        {/* Progress Indicator with Animation */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Course Progress</span>
            <span className="text-gray-400">{currentIndex + 1}/{LESSONS.length}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {isLastLesson ? '🎉 Course complete! Congratulations!' : ` ${Math.round(progressPercent)}% complete`}
          </p>
        </div>
      </div>
    </div>
  );
}
