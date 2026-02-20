import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const relayScenario = {
  topic: 'Market Research Report',
  stations: [
    {
      role: 'Researcher',
      icon: '🔍',
      task: 'Gather competitive intelligence',
      options: [
        { text: 'Search company websites and press releases', correct: true },
        { text: 'Make up market share numbers', correct: false },
        { text: 'Only check one competitor', correct: false }
      ]
    },
    {
      role: 'Analyst',
      icon: '📊',
      task: 'Identify key trends and patterns',
      options: [
        { text: 'Look for 3-year trend data', correct: true },
        { text: 'Report only positive findings', correct: false },
        { text: 'Skip data validation', correct: false }
      ]
    },
    {
      role: 'Writer',
      icon: '✍️',
      task: 'Draft executive summary',
      options: [
        { text: 'Create structured report with findings', correct: true },
        { text: 'Write a creative story about markets', correct: false },
        { text: 'List raw data without context', correct: false }
      ]
    },
    {
      role: 'Editor',
      icon: '✓',
      task: 'Review for accuracy and clarity',
      options: [
        { text: 'Fact-check claims against sources', correct: true },
        { text: 'Just fix grammar', correct: false },
        { text: 'Add more jargon to sound smart', correct: false }
      ]
    }
  ]
};

const lesson = LESSONS.find(l => l.slug === 'relay-race');

export default function RelayRace({ lessonId, onComplete }) {
  const [currentStation, setCurrentStation] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const station = relayScenario.stations[currentStation];
  const progress = ((currentStation) / relayScenario.stations.length) * 100;

  const handleSelect = (isCorrect) => {
    setWasCorrect(isCorrect);
    setShowFeedback(true);
    
    if (!isCorrect) {
      setAttempts(a => a + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        if (currentStation < relayScenario.stations.length - 1) {
          setCurrentStation(s => s + 1);
        } else {
          setIsComplete(true);
        }
      }
    }, 2000);
  };

  if (isComplete) {
    const xp = attempts === 0 ? lesson.xp : Math.round(lesson.xp * 0.8);
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={attempts === 0}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Relay Progress</span>
            <span>Station {currentStation + 1} of {relayScenario.stations.length}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-4">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          
          {/* Relay Track */}
          <div className="flex justify-between items-center">
            {relayScenario.stations.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                  ${i < currentStation ? 'bg-green-500' : i === currentStation ? 'bg-purple-500 animate-pulse' : 'bg-gray-700'}`}>
                  {i < currentStation ? '✓' : s.icon}
                </div>
                <span className={`text-xs mt-1 ${i === currentStation ? 'text-purple-400' : 'text-gray-500'}`}>
                  {s.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Station */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="text-center mb-4">
            <span className="text-4xl">{station.icon}</span>
            <h2 className="text-2xl font-bold text-white mt-2">{station.role}</h2>
            <p className="text-purple-400">{station.task}</p>
          </div>
        </div>

        {/* Topic */}
        <div className="bg-purple-900/20 rounded-xl p-4 mb-6 border border-purple-500/30">
          <p className="text-sm text-gray-400">Project: <span className="text-white">{relayScenario.topic}</span></p>
        </div>

        {/* Options */}
        <p className="text-gray-400 text-center mb-4">Choose the right approach:</p>
        
        <div className="space-y-3 mb-6">
          {station.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(option.correct)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50
                ${showFeedback && option.correct 
                  ? 'bg-green-900/30 border-green-500' 
                  : showFeedback && !option.correct
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
                }`}
            >
              <span className="text-white">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-xl border ${wasCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
            <p className={`text-center font-bold ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? '✓ Correct! Pass the baton →' : '✗ Try again'}
            </p>
          </div>
        )}

        {attempts > 0 && (
          <p className="text-center text-yellow-400 text-sm mt-4">
            Attempts: {attempts}
          </p>
        )}
      </div>
    </div>
  );
}
