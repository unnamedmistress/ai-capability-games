import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';

const scenarios = [
  { text: "I need to write a board update email to executives", role: 'Editor', explanation: "Emails require tone, clarity, and audience adaptation - classic editing work." },
  { text: "I'm stuck choosing between two marketing strategies", role: 'Thinking Partner', explanation: "This needs dialogue, exploration of tradeoffs, and collaborative reasoning." },
  { text: "I want 20 tagline options for my new product", role: 'Generator', explanation: "Multiple creative variations is a generation task." },
  { text: "I wrote a project plan, does it have flaws?", role: 'Critic', explanation: "Reviewing and critiquing existing work is the Critic role." },
  { text: "Translate this paragraph to Spanish", role: 'Tool', explanation: "Direct transformation with clear input/output is a Tool use case." },
  { text: "Help me understand why my code is failing", role: 'Thinking Partner', explanation: "Debugging requires collaborative problem-solving and explanation." },
  { text: "Generate 10 blog post ideas", role: 'Generator', explanation: "Brainstorming multiple creative options is generation." },
  { text: "Review my resume for errors", role: 'Editor', explanation: "Proofreading and improving existing text is editing." }
];

const roles = [
  { id: 'Tool', label: 'Tool', desc: 'Direct transformation', color: 'bg-blue-500' },
  { id: 'Thinking Partner', label: 'Thinking Partner', desc: 'Collaborative reasoning', color: 'bg-purple-500' },
  { id: 'Editor', label: 'Editor', desc: 'Improve & refine', color: 'bg-green-500' },
  { id: 'Critic', label: 'Critic', desc: 'Review & find flaws', color: 'bg-red-500' },
  { id: 'Generator', label: 'Generator', desc: 'Create options', color: 'bg-pink-500' }
];

export default function PartnershipCalibrator({ lessonId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const scenario = scenarios[currentIndex];
  const progress = ((currentIndex) / scenarios.length) * 100;

  const handleSelect = (role) => {
    if (showFeedback) return;
    
    setSelected(role);
    const isRight = role === scenario.role;
    setWasCorrect(isRight);
    
    if (isRight) {
      setCorrect(c => c + 1);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setShowFeedback(false);
      } else {
        const xp = correct >= 6 ? 100 : correct >= 4 ? 75 : 50;
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const xp = correct >= 6 ? 100 : correct >= 4 ? 75 : 50;
    return (
      <CompletionScreen
        lesson={{ 
          title: 'The Partnership Calibrator', 
          metacognition: 'Which mental model did I default to, and was it the most effective choice?',
          pitfall: 'Treating AI as a magic oracle for all problems, or as just a search engine.'
        }}
        xpEarned={xp}
        perfect={correct >= 7}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={{ 
          title: 'The Partnership Calibrator', 
          step: 'Step 1: Adopt the right mental model',
          layer: 'Foundation',
          icon: '🤝'
        }} 
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
            <span>Score: {correct}/{currentIndex + (showFeedback ? 1 : 0)}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Scenario Card */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-6 border border-gray-700">
          <p className="text-lg text-white mb-2">Scenario:</p>
          <p className="text-xl text-purple-300 font-medium">"{scenario.text}"</p>
        </div>

        {/* Role Selection */}
        <p className="text-gray-400 mb-4 text-center">Which AI mental model fits best?</p>
        
        <div className="grid grid-cols-1 gap-3">
          {roles.map(role => {
            const isSelected = selected === role.id;
            const isCorrect = role.id === scenario.role;
            
            let bgClass = 'bg-gray-800 border-gray-700 hover:border-gray-600';
            if (showFeedback && isCorrect) bgClass = 'bg-green-900/30 border-green-500';
            else if (showFeedback && isSelected && !isCorrect) bgClass = 'bg-red-900/30 border-red-500';
            else if (isSelected) bgClass = 'bg-purple-900/30 border-purple-500';
            
            return (
              <button
                key={role.id}
                onClick={() => handleSelect(role.id)}
                disabled={showFeedback}
                className={`p-4 rounded-xl border-2 transition-all text-left ${bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{role.label}</span>
                    <p className="text-sm text-gray-400">{role.desc}</p>
                  </div>
                  {showFeedback && isCorrect && <span className="text-green-400 text-xl">✓</span>}
                  {showFeedback && isSelected && !isCorrect && <span className="text-red-400 text-xl">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl ${wasCorrect ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
            <p className={`font-bold mb-1 ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? 'Correct!' : 'Not quite...'}
            </p>
            <p className="text-gray-300 text-sm">{scenario.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
