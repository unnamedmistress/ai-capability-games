import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const scenarios = [
  {
    id: 1,
    title: 'Vague Feature Request',
    original: 'Make the dashboard better. Users are complaining.',
    rounds: [
      { 
        text: 'Current: "Make the dashboard better. Users are complaining."',
        options: [
          { text: 'Ask: Which specific metrics need visibility?', correct: true, feedback: 'Good - targets specificity gap' },
          { text: 'Start designing new dashboard layouts', correct: false, feedback: 'Too early - need more context' }
        ]
      },
      { 
        text: 'Clarified: Users need better visibility into conversion funnel.',
        options: [
          { text: 'Add funnel visualization to existing dashboard', correct: true, feedback: 'Addresses the specific need' },
          { text: 'Redesign entire dashboard UI', correct: false, feedback: 'Scope creep - too broad' }
        ]
      },
      { 
        text: 'Added: Show drop-off points at each funnel stage.',
        options: [
          { text: 'Include actionable insights for each drop-off', correct: true, feedback: 'Perfect - adds actionable value' },
          { text: 'Show raw numbers only', correct: false, feedback: 'Missed opportunity for insights' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Unclear Bug Report',
    original: 'The login is broken. Fix ASAP.',
    rounds: [
      { 
        text: 'Current: "The login is broken. Fix ASAP."',
        options: [
          { text: 'Ask: What error message appears? Which users affected?', correct: true, feedback: 'Good - gathers diagnostic info' },
          { text: 'Rollback recent authentication changes', correct: false, feedback: 'Assumption without evidence' }
        ]
      },
      { 
        text: 'Clarified: OAuth error for users with 2FA enabled.',
        options: [
          { text: 'Check 2FA provider API status and recent changes', correct: true, feedback: 'Targeted investigation' },
          { text: 'Disable 2FA temporarily for all users', correct: false, feedback: 'Security risk - too drastic' }
        ]
      },
      { 
        text: 'Found: Provider deprecated legacy API endpoint.',
        options: [
          { text: 'Update to new API version and add fallback', correct: true, feedback: 'Complete fix with resilience' },
          { text: 'Switch to different 2FA provider', correct: false, feedback: 'Unnecessary migration work' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Generic Content Request',
    original: 'Write something about AI for our blog.',
    rounds: [
      { 
        text: 'Current: "Write something about AI for our blog."',
        options: [
          { text: 'Ask: What angle? Technical, business impact, or ethics?', correct: true, feedback: 'Good - narrows scope' },
          { text: 'Write comprehensive AI overview', correct: false, feedback: 'Too broad - will be shallow' }
        ]
      },
      { 
        text: 'Clarified: Focus on AI ROI for SMBs.',
        options: [
          { text: 'Include specific ROI metrics and case studies', correct: true, feedback: 'Adds credibility and value' },
          { text: 'Discuss general AI benefits', correct: false, feedback: 'Still too generic' }
        ]
      },
      { 
        text: 'Added: Target readers are operations managers.',
        options: [
          { text: 'Frame around operational efficiency and cost savings', correct: true, feedback: 'Perfect audience alignment' },
          { text: 'Include deep technical implementation details', correct: false, feedback: 'Wrong audience focus' }
        ]
      }
    ]
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-refinery');

export default function TheRefinery({ lessonId, onComplete }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [purity, setPurity] = useState(50);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const scenario = scenarios[scenarioIdx];
  const round = scenario.rounds[roundIdx];
  const progress = ((scenarioIdx * 3 + roundIdx) / (scenarios.length * 3)) * 100;

  const handleSelect = (optionIdx) => {
    const option = round.options[optionIdx];
    
    if (option.correct) {
      setPurity(p => Math.min(100, p + 20));
    } else {
      setPurity(p => Math.max(0, p - 10));
    }
    
    setFeedback(option.feedback);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      
      if (roundIdx < scenario.rounds.length - 1) {
        setRoundIdx(r => r + 1);
      } else if (scenarioIdx < scenarios.length - 1) {
        setScenarioIdx(s => s + 1);
        setRoundIdx(0);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const xp = purity >= 80 ? lesson.xp : Math.round(lesson.xp * (purity / 100));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={purity >= 90}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const purityColor = purity >= 80 ? 'bg-green-500' : purity >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={lesson}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{scenario.title} - Round {roundIdx + 1}/3</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-4">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          
          {/* Purity Meter */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Prompt Purity</span>
              <span className={`font-bold ${purity >= 80 ? 'text-green-400' : purity >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {purity}%
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${purityColor} transition-all duration-500`} style={{ width: `${purity}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Impure</span>
              <span>Refined</span>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-gray-300 leading-relaxed">{round.text}</p>
        </div>

        {/* Options */}
        <p className="text-gray-400 mb-4 text-center">Choose the refinement:</p>
        
        <div className="space-y-3 mb-6">
          {round.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50
                ${showFeedback && option.correct 
                  ? 'bg-green-900/30 border-green-500' 
                  : showFeedback && !option.correct
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-gray-800 border-gray-700 hover:border-cyan-500/50'
                }`}
            >
              <span className="text-white">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-xl border ${round.options.find(o => o.correct).feedback === feedback ? 'bg-green-900/30 border-green-500' : 'bg-yellow-900/30 border-yellow-500'}`}>
            <p className={`text-sm ${round.options.find(o => o.correct).feedback === feedback ? 'text-green-400' : 'text-yellow-400'}`}>
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
