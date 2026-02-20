import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const edits = [
  {
    id: 1,
    original: 'The new policy will affect all employees starting next month.',
    edited: 'The updated policy will impact all staff members beginning next month.',
    changes: [
      { type: 'neutral', text: '"new" → "updated"', explanation: 'Slight nuance shift, not significant' },
      { type: 'neutral', text: '"affect" → "impact"', explanation: 'Synonym, meaning preserved' },
      { type: 'neutral', text: '"employees" → "staff members"', explanation: 'Equivalent terms' },
      { type: 'neutral', text: '"starting" → "beginning"', explanation: 'Synonym, no meaning change' }
    ]
  },
  {
    id: 2,
    original: 'The project failed because the team missed the deadline.',
    edited: 'The project faced challenges due to timeline constraints encountered by the team.',
    changes: [
      { type: 'drift', text: '"failed" → "faced challenges"', explanation: 'Softens failure significantly - meaning drift' },
      { type: 'neutral', text: '"because" → "due to"', explanation: 'Equivalent causal language' },
      { type: 'drift', text: '"missed the deadline" → "timeline constraints"', explanation: 'Removes accountability, obscures what happened' }
    ]
  },
  {
    id: 3,
    original: 'Revenue increased by 15% in Q3, exceeding our target of 10%.',
    edited: 'Revenue grew by approximately 15% in Q3, meeting expectations.',
    changes: [
      { type: 'drift', text: '"increased" → "grew"', explanation: 'Actually neutral - equivalent terms' },
      { type: 'drift', text: '"15%" → "approximately 15%"', explanation: 'Adds uncertainty not in original' },
      { type: 'drift', text: '"exceeding our target of 10%" → "meeting expectations"', explanation: 'Removes specific achievement context' }
    ]
  }
];

const lesson = LESSONS.find(l => l.slug === 'red-pen-room');

export default function RedPenRoom({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [judgments, setJudgments] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const edit = edits[currentIdx];
  const progress = ((currentIdx) / edits.length) * 100;

  const handleJudgment = (changeIdx, judgment) => {
    if (showFeedback) return;
    setJudgments({ ...judgments, [changeIdx]: judgment });
  };

  const handleSubmit = () => {
    if (showFeedback) {
      if (currentIdx < edits.length - 1) {
        setCurrentIdx(i => i + 1);
        setJudgments({});
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
      return;
    }

    // Calculate score
    let roundCorrect = 0;
    edit.changes.forEach((change, idx) => {
      if (judgments[idx] === change.type) {
        roundCorrect++;
      }
    });
    
    setCorrect(c => c + roundCorrect);
    setShowFeedback(true);
  };

  if (isComplete) {
    const totalChanges = edits.reduce((acc, e) => acc + e.changes.length, 0);
    const xp = correct >= 6 ? lesson.xp : Math.round(lesson.xp * (correct / 6));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 8}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const allJudged = Object.keys(judgments).length === edit.changes.length;

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Edit {currentIdx + 1} of {edits.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">ORIGINAL</p>
            <p className="text-gray-300 text-sm">{edit.original}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">EDITED</p>
            <p className="text-gray-300 text-sm">{edit.edited}</p>
          </div>
        </div>

        {/* Changes */}
        <p className="text-gray-400 mb-4">Judge each change:</p>
        
        <div className="space-y-3 mb-6">
          {edit.changes.map((change, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all
                ${showFeedback 
                  ? judgments[idx] === change.type 
                    ? 'bg-green-900/30 border-green-500' 
                    : 'bg-red-900/30 border-red-500'
                  : judgments[idx] 
                    ? 'bg-gray-800 border-sky-500' 
                    : 'bg-gray-800 border-gray-700'
                }`}
            >
              <p className="text-white font-mono text-sm mb-3">{change.text}</p>
              
              {!showFeedback ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJudgment(idx, 'neutral')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                      ${judgments[idx] === 'neutral' 
                        ? 'bg-sky-600 text-white' 
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                  >
                    ✓ ACCEPT
                    <span className="block text-xs font-normal opacity-70">Preserves meaning</span>
                  </button>
                  <button
                    onClick={() => handleJudgment(idx, 'drift')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                      ${judgments[idx] === 'drift' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                  >
                    ✗ REJECT
                    <span className="block text-xs font-normal opacity-70">Drifts from intent</span>
                  </button>
                </div>
              ) : (
                <div className={`text-sm ${judgments[idx] === change.type ? 'text-green-400' : 'text-red-400'}`}>
                  {judgments[idx] === change.type ? '✓' : '✗'} {change.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allJudged}
          className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showFeedback 
            ? (currentIdx < edits.length - 1 ? 'Next Edit →' : 'See Results')
            : 'Submit Judgments'
          }
        </button>
      </div>
    </div>
  );
}
