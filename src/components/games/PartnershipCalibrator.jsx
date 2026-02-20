import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const scenarios = [
  { text: "I need to write a board update email to executives", role: 'Editor', explanation: "Emails require tone, clarity, and audience adaptation - classic editing work. The Editor role helps refine and improve existing content." },
  { text: "I'm stuck choosing between two marketing strategies", role: 'Thinking Partner', explanation: "This needs dialogue, exploration of tradeoffs, and collaborative reasoning. A Thinking Partner helps you work through complex decisions." },
  { text: "I want 20 tagline options for my new product", role: 'Generator', explanation: "Multiple creative variations is a generation task. The Generator creates many options for you to choose from." },
  { text: "I wrote a project plan, does it have flaws?", role: 'Critic', explanation: "Reviewing and critiquing existing work is the Critic role. They find problems and gaps in what you've created." },
  { text: "Translate this paragraph to Spanish", role: 'Tool', explanation: "Direct transformation with clear input/output is a Tool use case. Tools perform specific, well-defined tasks." },
  { text: "Help me understand why my code is failing", role: 'Thinking Partner', explanation: "Debugging requires collaborative problem-solving and explanation. A Thinking Partner helps you think through the issue." },
  { text: "Generate 10 blog post ideas", role: 'Generator', explanation: "Brainstorming multiple creative options is generation. The Generator excels at creative divergence." },
  { text: "Review my resume for errors", role: 'Editor', explanation: "Proofreading and improving existing text is editing. The Editor polishes and refines your work." }
];

const roles = [
  { id: 'Tool', label: 'Tool', desc: 'Direct transformation', color: 'bg-blue-500', icon: '🔧' },
  { id: 'Thinking Partner', label: 'Thinking Partner', desc: 'Collaborative reasoning', color: 'bg-purple-500', icon: '🧠' },
  { id: 'Editor', label: 'Editor', desc: 'Improve & refine', color: 'bg-green-500', icon: '✏️' },
  { id: 'Critic', label: 'Critic', desc: 'Review & find flaws', color: 'bg-red-500', icon: '🔍' },
  { id: 'Generator', label: 'Generator', desc: 'Create options', color: 'bg-pink-500', icon: '✨' }
];

const lesson = LESSONS.find(l => l.slug === 'partnership-calibrator');

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
    // Prevent any interaction while showing feedback
    if (showFeedback) return;
    
    setSelected(role);
    const isRight = role === scenario.role;
    setWasCorrect(isRight);
    
    if (isRight) {
      setCorrect(c => c + 1);
    }
    
    setShowFeedback(true);
    
    // Delay before moving to next scenario
    setTimeout(() => {
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 3000); // Increased delay for better reading
  };

  if (isComplete) {
    const xp = correct >= 6 ? lesson.xp : correct >= 4 ? Math.round(lesson.xp * 0.75) : Math.round(lesson.xp * 0.5);
    return (
      <CompletionScreen
        lesson={lesson}
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
        lesson={lesson}
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

        {/* Instructions */}
        {!showFeedback && (
          <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <p className="text-blue-300 text-sm">
              <strong>Instructions:</strong> Read each scenario and select the AI mental model that fits best. 
              Each model has a different purpose - choose the one that matches what the user needs.
            </p>
          </div>
        )}

        {/* Scenario Card */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-6 border border-gray-700">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Scenario</p>
          <p className="text-xl text-white font-medium">"{scenario.text}"</p>
        </div>

        {/* Role Selection */}
        <p className="text-gray-400 mb-4 text-center font-medium">
          {showFeedback ? 'Feedback:' : 'Which AI mental model fits best?'}
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {roles.map(role => {
            const isSelected = selected === role.id;
            const isCorrect = role.id === scenario.role;
            
            let bgClass = 'bg-gray-800 border-gray-700 hover:border-purple-500/50';
            let statusIcon = null;
            
            if (showFeedback) {
              if (isCorrect) {
                bgClass = 'bg-green-900/30 border-green-500';
                statusIcon = <span className="text-green-400 text-xl font-bold">✓ CORRECT</span>;
              } else if (isSelected && !isCorrect) {
                bgClass = 'bg-red-900/30 border-red-500';
                statusIcon = <span className="text-red-400 text-xl font-bold">✗ YOUR CHOICE</span>;
              } else {
                bgClass = 'bg-gray-800 border-gray-700 opacity-50';
              }
            } else if (isSelected) {
              bgClass = 'bg-purple-900/30 border-purple-500';
            }
            
            return (
              <button
                key={role.id}
                onClick={() => handleSelect(role.id)}
                disabled={showFeedback}
                className={`p-4 rounded-xl border-2 transition-all text-left ${bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{role.icon}</span>
                    <div>
                      <span className="font-bold text-white block">{role.label}</span>
                      <p className="text-sm text-gray-400">{role.desc}</p>
                    </div>
                  </div>
                  {statusIcon}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback - Enhanced with clear explanation */}
        {showFeedback && (
          <div className={`mt-6 p-6 rounded-xl border-2 ${wasCorrect ? 'bg-green-900/20 border-green-500' : 'bg-amber-900/20 border-amber-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{wasCorrect ? '✅' : '💡'}</span>
              <p className={`font-bold text-lg ${wasCorrect ? 'text-green-400' : 'text-amber-400'}`}>
                {wasCorrect ? 'Correct!' : `The answer was: ${scenario.role}`}
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed">{scenario.explanation}</p>
            
            {!wasCorrect && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-sm">
                  <strong>Why this matters:</strong> Using the right mental model helps you get better results from AI. 
                  {scenario.role === 'Thinking Partner' && ' Thinking Partners help you reason through complex problems.'}
                  {scenario.role === 'Editor' && ' Editors improve existing content rather than creating from scratch.'}
                  {scenario.role === 'Generator' && ' Generators excel at creating multiple options quickly.'}
                  {scenario.role === 'Critic' && ' Critics find problems and gaps you might have missed.'}
                  {scenario.role === 'Tool' && ' Tools perform specific, predictable transformations.'}
                </p>
              </div>
            )}
            
            <p className="text-gray-500 text-sm mt-4 text-center">
              Next scenario in 3 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
