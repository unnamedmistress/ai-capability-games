import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const transformations = [
  {
    id: 1,
    original: 'The Q3 financial results demonstrate a 15% increase in revenue, driven primarily by expansion in the enterprise segment. Operating margins improved by 200 basis points due to cost optimization initiatives.',
    audiences: [
      { 
        name: 'Executive Summary',
        transform: 'Q3 revenue up 15% on enterprise growth; margins +200bps from cost cuts.',
        correct: true
      },
      { 
        name: 'Technical Team',
        transform: 'We implemented cost optimization algorithms that reduced OPEX by implementing automated resource allocation and streamlining vendor contracts.',
        correct: false,
        error: 'Adds technical details not in original'
      },
      {
        name: 'Board of Directors',
        transform: 'The company achieved strong Q3 performance with double-digit revenue growth and margin expansion, positioning us well for future strategic initiatives.',
        correct: true
      }
    ]
  },
  {
    id: 2,
    original: 'Server response times increased from 120ms to 340ms during peak hours. The database connection pool was exhausted, causing timeout errors for 12% of requests.',
    audiences: [
      {
        name: 'Customer Support',
        transform: 'Some users may experience slower loading times during busy periods. Our team is actively working on improvements.',
        correct: true
      },
      {
        name: 'Engineering Team',
        transform: 'We need to increase the DB connection pool size and implement connection pooling optimizations. The current max_connections setting is too low for peak load.',
        correct: true
      },
      {
        name: 'Social Media',
        transform: 'Our servers are completely broken and nobody can use the app! This is a disaster! 🚨',
        correct: false,
        error: 'Exaggerates severity and uses inappropriate tone'
      }
    ]
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-shapeshifter');

export default function TheShapeshifter({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selected, setSelected] = useState({});

  const transform = transformations[currentIdx];
  const progress = ((currentIdx) / transformations.length) * 100;

  const handleSelect = (audienceIdx, isCorrect) => {
    if (showFeedback) return;
    
    setSelected({ ...selected, [audienceIdx]: true });
    
    if (isCorrect) {
      setCorrect(c => c + 1);
    }
    
    // Check if all options selected
    if (Object.keys(selected).length + 1 === transform.audiences.length) {
      setShowFeedback(true);
      setTimeout(() => {
        if (currentIdx < transformations.length - 1) {
          setCurrentIdx(i => i + 1);
          setShowFeedback(false);
          setSelected({});
        } else {
          setIsComplete(true);
        }
      }, 3000);
    }
  };

  if (isComplete) {
    const totalPossible = transformations.reduce((acc, t) => acc + t.audiences.filter(a => !a.error).length, 0);
    const xp = correct >= 3 ? lesson.xp : Math.round(lesson.xp * (correct / 3));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 4}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Scenario {currentIdx + 1} of {transformations.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Original Text */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Original text:</p>
          <p className="text-gray-300 italic">"{transform.original}"</p>
        </div>

        <p className="text-gray-400 text-center mb-6">
          Identify which transformations are appropriate for each audience:
        </p>

        {/* Audience Cards */}
        <div className="space-y-4 mb-6">
          {transform.audiences.map((aud, idx) => {
            const isSelected = selected[idx] !== undefined;
            const showResult = isSelected || showFeedback;
            
            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all
                  ${showResult 
                    ? aud.correct 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-red-900/30 border-red-500'
                    : 'bg-gray-800 border-gray-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{aud.name}</span>
                  {showResult && (
                    <span className={aud.correct ? 'text-green-400' : 'text-red-400'}>
                      {aud.correct ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">"{aud.transform}"</p>
                
                {!showResult ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelect(idx, aud.correct)}
                      className="flex-1 py-2 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-sm hover:bg-green-900/50"
                    >
                      ✓ Appropriate
                    </button>
                    <button
                      onClick={() => handleSelect(idx, !aud.correct)}
                      className="flex-1 py-2 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm hover:bg-red-900/50"
                    >
                      ✗ Problematic
                    </button>
                  </div>
                ) : !aud.correct && (
                  <p className="text-red-400 text-sm">Issue: {aud.error}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
