import React from 'react';

export default function CompletionScreen({ lesson, xpEarned, perfect, onNext, onReplay }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
        <div className="mb-6">
          <span className="text-6xl">{perfect ? '🎉' : '✨'}</span>
          <h1 className="text-2xl font-bold text-white mt-4">Lesson Complete!</h1>
          <p className="text-gray-400 mt-2">You earned <span className="text-yellow-400 font-bold">{xpEarned} XP</span></p>
          {perfect && (
            <p className="text-green-400 mt-2">Perfect score! 🏆</p>
          )}
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-2">Metacognition Question</h2>
          <p className="text-gray-300">{lesson.metacognition}</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-2">Pitfall to Avoid</h2>
          <p className="text-gray-300">{lesson.pitfall}</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onNext}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors"
          >
            Continue
          </button>
          <button
            onClick={onReplay}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white transition-colors"
          >
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
