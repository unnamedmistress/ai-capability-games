import React, { useState, useEffect } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const scenarios = [
  {
    id: 1,
    title: 'Marketing Campaign',
    topic: 'Launch sustainable product line',
    audience: 'Eco-conscious millennials',
    constraints: ['Budget under $10K', 'Must go viral organically', 'Launch in 2 weeks']
  },
  {
    id: 2,
    title: 'Bug Fix Documentation',
    topic: 'Payment gateway timeout issue',
    audience: 'Engineering team',
    constraints: ['Include root cause', 'Add monitoring alerts', 'Document rollback']
  },
  {
    id: 3,
    title: 'Team Offsite Plan',
    topic: 'Quarterly team building retreat',
    audience: '25-person engineering team',
    constraints: ['2-day event', 'Under $5K budget', 'Mix fun + learning']
  },
  {
    id: 4,
    title: 'Feature Pitch',
    topic: 'AI-powered code review assistant',
    audience: 'Product leadership',
    constraints: ['Show ROI calculation', 'Address security concerns', '3-month timeline']
  },
  {
    id: 5,
    title: 'User Research Study',
    topic: 'Understand onboarding drop-off',
    audience: 'Product and UX team',
    constraints: ['20 participants', '1 week turnaround', 'Quant + qual insights']
  }
];

const blockTypes = [
  { id: 'Role', label: 'Role', example: 'You are a...' },
  { id: 'Task', label: 'Task', example: 'Your task is to...' },
  { id: 'Format', label: 'Format', example: 'Output as...' },
  { id: 'Constraints', label: 'Constraints', example: 'Follow these rules...' },
  { id: 'Examples', label: 'Examples', example: 'Here are samples...' },
  { id: 'Audience', label: 'Audience', example: 'For this audience...' }
];

// Required blocks for each scenario
const requiredBlocks = {
  1: ['Role', 'Audience', 'Format', 'Constraints'],
  2: ['Role', 'Task', 'Constraints', 'Examples'],
  3: ['Role', 'Task', 'Format', 'Constraints'],
  4: ['Role', 'Task', 'Audience', 'Format'],
  5: ['Role', 'Task', 'Constraints', 'Audience']
};

const lesson = LESSONS.find(l => l.slug === 'speed-draft-arena');

export default function SpeedDraftArena({ lessonId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const scenario = scenarios[currentIndex];
  const currentRequired = requiredBlocks[scenario.id];
  const progress = ((currentIndex) / scenarios.length) * 100;

  useEffect(() => {
    if (!showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
  }, [timeLeft, showFeedback]);

  const toggleBlock = (blockId) => {
    if (showFeedback) return;
    
    if (selectedBlocks.includes(blockId)) {
      setSelectedBlocks(selectedBlocks.filter(b => b !== blockId));
    } else {
      setSelectedBlocks([...selectedBlocks, blockId]);
    }
  };

  const handleSubmit = () => {
    if (showFeedback) return;
    
    const correctCount = selectedBlocks.filter(block => 
      currentRequired.includes(block)
    ).length;
    
    if (correctCount >= 4) {
      setCorrect(c => c + 1);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedBlocks([]);
        setShowFeedback(false);
        setTimeLeft(90);
      } else {
        setIsComplete(true);
      }
    }, 2500);
  };

  if (isComplete) {
    const xp = correct >= 4 ? lesson.xp : Math.round(lesson.xp * (correct / 4));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 5}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={lesson}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress & Timer */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-3">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className={`text-right font-mono text-2xl font-bold ${timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2">{scenario.title}</h2>
          <p className="text-amber-300 mb-4">Topic: {scenario.topic}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Audience: <span className="text-gray-300">{scenario.audience}</span></p>
            <div className="text-sm text-gray-400">
              Constraints:
              <ul className="mt-1 space-y-1">
                {scenario.constraints.map((c, i) => (
                  <li key={i} className="text-gray-300 flex items-center gap-2">
                    <span className="text-amber-500">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Prompt Blocks */}
        <p className="text-gray-400 mb-4 text-center">
          Select the essential prompt blocks (need 4+ correct to win)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {blockTypes.map(block => {
            const isSelected = selectedBlocks.includes(block.id);
            const isRequired = currentRequired.includes(block.id);
            
            return (
              <button
                key={block.id}
                onClick={() => toggleBlock(block.id)}
                disabled={showFeedback}
                className={`p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50
                  ${isSelected 
                    ? showFeedback && isRequired
                      ? 'bg-green-900/30 border-green-500' 
                      : showFeedback && !isRequired
                        ? 'bg-red-900/30 border-red-500'
                        : 'bg-amber-900/30 border-amber-500'
                    : 'bg-gray-800 border-gray-700 hover:border-amber-500/50'
                  }`}
              >
                <span className="font-bold text-white block">{block.label}</span>
                <span className="text-xs text-gray-400">{block.example}</span>
                {showFeedback && isRequired && (
                  <span className="text-green-400 text-xs block mt-1">✓ Essential</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Assembly Zone */}
        <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-dashed border-gray-600">
          <p className="text-sm text-gray-400 mb-2">Assembled prompt ({selectedBlocks.length}/6 blocks):</p>
          <div className="flex flex-wrap gap-2">
            {selectedBlocks.map((blockId, i) => {
              const block = blockTypes.find(b => b.id === blockId);
              return (
                <span key={i} className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-lg text-sm border border-amber-500/30">
                  {i + 1}. {block.label}
                </span>
              );
            })}
            {selectedBlocks.length === 0 && (
              <span className="text-gray-600 text-sm">Click blocks above to assemble your prompt...</span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={showFeedback || selectedBlocks.length < 4}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showFeedback ? 'Next...' : 'Submit Draft'}
        </button>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 p-4 rounded-xl border bg-gray-800/50 border-gray-600">
            <p className="text-gray-300 text-center">
              {selectedBlocks.filter(b => currentRequired.includes(b)).length >= 4 
                ? '✓ Strong prompt structure!' 
                : 'Consider adding more essential blocks for a complete prompt.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
