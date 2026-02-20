import React, { useState, useEffect } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const tasks = [
  { id: 1, oneShot: true, text: 'Write a birthday message to a colleague', explanation: 'Single context, single output, no dependencies.' },
  { id: 2, oneShot: false, text: 'Create a comprehensive onboarding deck', explanation: 'Requires multiple sections, stakeholder input, and iterations.' },
  { id: 3, oneShot: true, text: 'Translate this paragraph to Spanish', explanation: 'Direct transformation with clear input/output.' },
  { id: 4, oneShot: false, text: 'Develop annual product roadmap', explanation: 'Needs research, synthesis, stakeholder alignment, multiple phases.' },
  { id: 5, oneShot: true, text: 'Generate 10 blog post titles', explanation: 'Single brainstorming request, immediate output.' },
  { id: 6, oneShot: false, text: 'Conduct quarterly user research study', explanation: 'Requires planning, recruitment, execution, analysis, reporting.' },
  { id: 7, oneShot: true, text: 'Summarize this article in 3 bullet points', explanation: 'Single input, single transformation.' },
  { id: 8, oneShot: false, text: 'Implement new authentication system', explanation: 'Design, security review, implementation, testing, rollout.' },
  { id: 9, oneShot: true, text: 'Draft a follow-up email to the client', explanation: 'Single context, single response.' },
  { id: 10, oneShot: false, text: 'Build company-wide analytics dashboard', explanation: 'Data sources, visualization design, user testing, iteration.' }
];

const lesson = LESSONS.find(l => l.slug === 'workflow-sorter');

export default function WorkflowSorter({ lessonId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [timerActive, setTimerActive] = useState(true);
  const [cardPosition, setCardPosition] = useState(0);

  const streakMultiplier = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
  const progress = ((currentIndex) / tasks.length) * 100;

  // Card animation
  useEffect(() => {
    if (!timerActive || showFeedback) return;
    
    const startTime = Date.now();
    const duration = 5000; // 5 seconds to cross
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newPosition = Math.min((elapsed / duration) * 100, 100);
      setCardPosition(newPosition);
      
      if (newPosition < 100) {
        requestAnimationFrame(animate);
      } else {
        // Time's up - auto wrong
        handleSelect(null);
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [currentIndex, timerActive, showFeedback]);

  const handleSelect = (choice) => {
    if (showFeedback) return;
    
    setTimerActive(false);
    const task = tasks[currentIndex];
    const isCorrect = choice === task.oneShot;
    
    setWasCorrect(isCorrect);
    
    if (isCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < tasks.length - 1) {
        setCurrentIndex(i => i + 1);
        setShowFeedback(false);
        setCardPosition(0);
        setTimerActive(true);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const xp = correct >= 7 ? lesson.xp : Math.round(lesson.xp * (correct / 7));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 9}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const task = tasks[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={lesson}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress & Stats */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Task {currentIndex + 1} of {tasks.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-3">
            <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <span className="text-orange-400 font-bold">🔥 {streak} streak</span>
              )}
              {streak >= 3 && (
                <span className="text-xs bg-orange-900/50 text-orange-400 px-2 py-1 rounded">
                  x{streakMultiplier}
                </span>
              )}
            </div>
            <div className={`text-sm font-mono ${timeLeft <= 2 ? 'text-red-400' : 'text-gray-400'}`}>
              {Math.ceil((100 - cardPosition) / 20)}s
            </div>
          </div>
        </div>

        {/* Sliding Card */}
        <div className="relative h-48 mb-8 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-red-500/50" /> {/* Edge marker */}
          
          <div 
            className="absolute top-0 h-full transition-transform duration-75"
            style={{ transform: `translateX(${cardPosition}%)`, left: '-40%' }}
          >
            <div className="h-full w-64 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-6 flex flex-col justify-center shadow-2xl">
              <span className="text-xs text-white/70 mb-2">Incoming Task:</span>
              <p className="text-white font-medium">{task.text}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <p className="text-gray-400 mb-4 text-center">Click before the card reaches the edge!</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleSelect(true)}
            disabled={showFeedback}
            className="py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold text-white text-lg transition-all active:scale-95"
          >
            ONE-SHOT
            <span className="block text-xs font-normal text-blue-200 mt-1">Single prompt</span>
          </button>
          <button
            onClick={() => handleSelect(false)}
            disabled={showFeedback}
            className="py-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl font-bold text-white text-lg transition-all active:scale-95"
          >
            STAGED
            <span className="block text-xs font-normal text-purple-200 mt-1">Multi-step workflow</span>
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-xl border ${wasCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
            <p className={`font-bold mb-1 ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? '✓ Correct!' : choice === null ? "⏰ Time's up!" : '✗ Wrong'}
            </p>
            <p className="text-gray-300 text-sm">{task.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
