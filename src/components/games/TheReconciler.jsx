import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const sources = [
  {
    id: 1,
    title: 'Market Analysis Report 2023',
    claims: ['Cloud market grew 35% YoY', 'AWS maintains 32% market share', 'Azure grew faster than AWS'],
    trust: 'high'
  },
  {
    id: 2,
    title: 'TechCrunch Startup News',
    claims: ['New AI unicorn valued at $2B', 'Company claims 99.9% accuracy', 'CEO promises 10x growth'],
    trust: 'medium'
  },
  {
    id: 3,
    title: 'Random Tech Blog',
    claims: ['This framework is the best', 'All other tools are obsolete', 'Everyone is switching now'],
    trust: 'low'
  }
];

const conflicts = [
  {
    id: 1,
    topic: 'Cloud Market Growth',
    sourceA: { name: 'Gartner Research', claim: 'Cloud market grew 35% in 2023', trust: 90 },
    sourceB: { name: 'Tech Blog Estimate', claim: 'Cloud market grew 60% in 2023', trust: 40 },
    resolution: 'A',
    explanation: 'Gartner is a reputable research firm with established methodology. The tech blog provides no data sources.'
  },
  {
    id: 2,
    topic: 'AI Model Performance',
    sourceA: { name: 'Peer-Reviewed Study', claim: 'New model achieves 85% accuracy on benchmark', trust: 95 },
    sourceB: { name: 'Vendor Press Release', claim: 'Our model achieves 99% accuracy', trust: 30 },
    resolution: 'A',
    explanation: 'Peer-reviewed research has verified methodology. Vendor claims lack independent verification and likely use different metrics.'
  },
  {
    id: 3,
    topic: 'Security Breach Impact',
    sourceA: { name: 'Company Statement', claim: 'No sensitive data was accessed', trust: 50 },
    sourceB: { name: 'Security Researcher', claim: 'Personal data of 10M users exposed', trust: 80 },
    resolution: 'B',
    explanation: 'Independent security researchers have evidence. Company statements often minimize impact during incidents.'
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-reconciler');

export default function TheReconciler({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selected, setSelected] = useState(null);

  const conflict = conflicts[currentIdx];
  const progress = ((currentIdx) / conflicts.length) * 100;

  const handleSelect = (choice) => {
    if (showFeedback) return;
    setSelected(choice);
    
    const isCorrect = choice === conflict.resolution;
    if (isCorrect) setCorrect(c => c + 1);
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIdx < conflicts.length - 1) {
        setCurrentIdx(i => i + 1);
        setShowFeedback(false);
        setSelected(null);
      } else {
        setIsComplete(true);
      }
    }, 3000);
  };

  if (isComplete) {
    const xp = correct >= 2 ? lesson.xp : Math.round(lesson.xp * (correct / 2));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 3}
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
            <span>Conflict {currentIdx + 1} of {conflicts.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Topic */}
        <div className="text-center mb-6">
          <span className="text-emerald-400 text-sm font-bold tracking-wider">TOPIC</span>
          <h2 className="text-2xl font-bold text-white mt-1">{conflict.topic}</h2>
        </div>

        {/* Sources */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Source A */}
          <button
            onClick={() => handleSelect('A')}
            disabled={showFeedback}
            className={`p-6 rounded-2xl border-2 text-left transition-all disabled:opacity-50
              ${showFeedback && conflict.resolution === 'A' 
                ? 'bg-green-900/30 border-green-500' 
                : showFeedback && selected === 'A'
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-gray-800 border-gray-700 hover:border-emerald-500/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📄</span>
              <span className="font-bold text-white">{conflict.sourceA.name}</span>
            </div>
            <p className="text-emerald-300 mb-2">"{conflict.sourceA.claim}"</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Trust:</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${conflict.sourceA.trust}%` }} 
                />
              </div>
              <span className="text-xs text-emerald-400">{conflict.sourceA.trust}%</span>
            </div>
          </button>

          {/* Source B */}
          <button
            onClick={() => handleSelect('B')}
            disabled={showFeedback}
            className={`p-6 rounded-2xl border-2 text-left transition-all disabled:opacity-50
              ${showFeedback && conflict.resolution === 'B' 
                ? 'bg-green-900/30 border-green-500' 
                : showFeedback && selected === 'B'
                  ? 'bg-red-900/30 border-red-500'
                  : 'bg-gray-800 border-gray-700 hover:border-emerald-500/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📄</span>
              <span className="font-bold text-white">{conflict.sourceB.name}</span>
            </div>
            <p className="text-emerald-300 mb-2">"{conflict.sourceB.claim}"</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Trust:</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${conflict.sourceB.trust}%` }} 
                />
              </div>
              <span className="text-xs text-emerald-400">{conflict.sourceB.trust}%</span>
            </div>
          </button>
        </div>

        {/* Both Wrong Option */}
        <button
          onClick={() => handleSelect('both')}
          disabled={showFeedback}
          className="w-full py-3 mb-6 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-all disabled:opacity-50"
        >
          ⚠️ Both sources seem questionable / Insufficient information
        </button>

        {/* Feedback */}
        {showFeedback && (
          <div className="p-4 rounded-xl border bg-emerald-900/20 border-emerald-500/50">
            <p className="text-emerald-400 font-bold mb-2">
              {selected === conflict.resolution ? '✓ Correct assessment!' : '✗ Consider the evidence'}
            </p>
            <p className="text-gray-300 text-sm">{conflict.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
