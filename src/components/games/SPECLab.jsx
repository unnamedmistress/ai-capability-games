import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const specSlots = ['S', 'P', 'E', 'C'];
const specLabels = {
  S: { name: 'Situation', desc: 'What is the context?', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
  P: { name: 'Purpose', desc: 'What do you want to achieve?', color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'border-pink-500/30' },
  E: { name: 'Expectations', desc: 'What should the output look like?', color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-500/30' },
  C: { name: 'Constraints', desc: 'What are the limitations?', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/30' }
};

const challenges = [
  {
    fragments: [
      { text: "I'm preparing for a job interview", slot: 'S' },
      { text: "Practice answering common questions", slot: 'P' },
      { text: "Be concise, 2-3 sentences per answer", slot: 'E' },
      { text: "For a software engineering role", slot: 'S' },
      { text: "30 minutes total", slot: 'C' },
      { text: "Act like an experienced interviewer", slot: 'E' },
      { text: "Focus on behavioral questions", slot: 'C' },
      { text: "Give me feedback on my answers", slot: 'P' },
      { text: "At a FAANG company", slot: 'S' },
      { text: "Next Tuesday is my interview", slot: 'C' },
      { text: "Use STAR method examples", slot: 'E' },
      { text: "Help me improve my responses", slot: 'P' }
    ]
  }
];

// Example for tutorial
const tutorialExample = {
  fragment: "I need a summary of our Q3 sales data",
  correctSlot: 'P',
  explanation: "This is the Purpose - it states what the user wants to achieve."
};

const lesson = LESSONS.find(l => l.slug === 'spec-lab');

export default function SPECLab({ lessonId, onComplete }) {
  const [slots, setSlots] = useState({ S: [], P: [], E: [], C: [] });
  const [available, setAvailable] = useState(challenges[0].fragments);
  const [isComplete, setIsComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showExample, setShowExample] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedFragment, setSelectedFragment] = useState(null);

  const moveToSlot = (fragment, slot) => {
    if (slots[slot].includes(fragment)) return;
    setSlots({ ...slots, [slot]: [...slots[slot], fragment] });
    setAvailable(available.filter(f => f !== fragment));
    setSelectedFragment(null);
    setShowTutorial(false);
  };

  const removeFromSlot = (fragment, slot) => {
    setSlots({ ...slots, [slot]: slots[slot].filter(f => f !== fragment) });
    setAvailable([...available, fragment]);
  };

  const allCorrect = () => {
    return Object.entries(slots).every(([slot, fragments]) => 
      fragments.every(f => f.slot === slot)
    ) && Object.values(slots).every(arr => arr.length > 0);
  };

  const handleComplete = () => {
    const correct = Object.entries(slots).every(([slot, fragments]) => 
      fragments.every(f => f.slot === slot)
    );
    const xp = correct ? lesson.xp : Math.round(lesson.xp * 0.75);
    setIsComplete(true);
  };

  const handleShowAnswers = () => {
    if (confirm('This will show you the correct answers. Use this to learn, then try again!')) {
      setShowAnswers(true);
      // Auto-fill all slots correctly
      const correctSlots = { S: [], P: [], E: [], C: [] };
      challenges[0].fragments.forEach(fragment => {
        correctSlots[fragment.slot].push(fragment);
      });
      setSlots(correctSlots);
      setAvailable([]);
    }
  };

  const handleReset = () => {
    if (confirm('Start over? All progress will be reset.')) {
      setSlots({ S: [], P: [], E: [], C: [] });
      setAvailable(challenges[0].fragments);
      setShowAnswers(false);
      setShowTutorial(true);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e, fragment) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedFragment(fragment);
    }
  };

  if (isComplete) {
    const allCorrect = Object.entries(slots).every(([slot, fragments]) => 
      fragments.every(f => f.slot === slot)
    );
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={allCorrect ? lesson.xp : Math.round(lesson.xp * 0.75)}
        perfect={allCorrect}
        onNext={() => onComplete(allCorrect ? lesson.xp : Math.round(lesson.xp * 0.75))}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const getPreviewText = () => {
    const hasAll = Object.values(slots).every(arr => arr.length > 0);
    if (!hasAll) return "[Fill all 4 SPEC slots to see your complete prompt preview]";
    return `Context: ${slots.S.map(f => f.text).join(', ')}
Goal: ${slots.P.map(f => f.text).join(', ')}
Format: ${slots.E.map(f => f.text).join(', ')}
Limits: ${slots.C.map(f => f.text).join(', ')}`;
  };

  const getProgress = () => {
    const filled = Object.values(slots).reduce((acc, arr) => acc + arr.length, 0);
    return Math.min((filled / 12) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${getProgress()}%` }} />
          </div>
        </div>

        {/* Tutorial Banner */}
        {showTutorial && (
          <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h3 className="font-bold text-blue-400 mb-2">How to Use SPEC Framework</h3>
                <p className="text-gray-300 text-sm mb-3">
                  SPEC helps you structure prompts clearly. Each letter represents a key component:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-purple-900/30 p-2 rounded border border-purple-500/30">
                    <strong className="text-purple-400">S - Situation:</strong> Context and background
                  </div>
                  <div className="bg-pink-900/30 p-2 rounded border border-pink-500/30">
                    <strong className="text-pink-400">P - Purpose:</strong> What you want to achieve
                  </div>
                  <div className="bg-amber-900/30 p-2 rounded border border-amber-500/30">
                    <strong className="text-amber-400">E - Expectations:</strong> Format and style
                  </div>
                  <div className="bg-emerald-900/30 p-2 rounded border border-emerald-500/30">
                    <strong className="text-emerald-400">C - Constraints:</strong> Limitations and rules
                  </div>
                </div>
                
                {/* Interactive Example */}
                <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                  <p className="text-gray-400 text-xs mb-2">🎯 Example:</p>
                  <p className="text-white text-sm mb-2">"{tutorialExample.fragment}"</p>
                  <p className="text-green-400 text-xs">
                    ✓ This goes in <strong>{tutorialExample.correctSlot} - {specLabels[tutorialExample.correctSlot].name}</strong><br/>
                    <span className="text-gray-400">{tutorialExample.explanation}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="text-blue-400 text-sm underline hover:text-blue-300"
                  >
                    Got it, start playing
                  </button>
                  <span className="text-gray-600">•</span>
                  <button 
                    onClick={() => setShowExample(true)}
                    className="text-blue-400 text-sm underline hover:text-blue-300"
                  >
                    See full example
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Example Modal */}
        {showExample && (
          <div className="mb-6 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-green-400">📚 Complete SPEC Example</h3>
              <button 
                onClick={() => setShowExample(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-purple-900/20 p-3 rounded border-l-4 border-purple-500">
                <strong className="text-purple-400">S - Situation:</strong>
                <p className="text-gray-300">"I'm a marketing manager at a SaaS startup preparing for a product launch. We have 3 competitors in the space."</p>
              </div>
              <div className="bg-pink-900/20 p-3 rounded border-l-4 border-pink-500">
                <strong className="text-pink-400">P - Purpose:</strong>
                <p className="text-gray-300">"I need a competitive analysis comparing our features to the top 2 competitors."</p>
              </div>
              <div className="bg-amber-900/20 p-3 rounded border-l-4 border-amber-500">
                <strong className="text-amber-400">E - Expectations:</strong>
                <p className="text-gray-300">"Create a comparison table with pros/cons for each, written in professional business language."</p>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded border-l-4 border-emerald-500">
                <strong className="text-emerald-400">C - Constraints:</strong>
                <p className="text-gray-300">"Keep it under 500 words. Focus on features, not pricing."</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available fragments */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Available Fragments</h3>
              <span className="text-sm text-gray-500">{available.length} remaining</span>
            </div>
            
            {available.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-3xl block mb-2">🎉</span>
                All fragments assigned!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {available.map((fragment, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFragment(fragment)}
                    onKeyDown={(e) => handleKeyDown(e, fragment)}
                    tabIndex={0}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white hover:border-purple-500 hover:bg-gray-800 transition-all text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label={`Fragment: ${fragment.text}. Press Enter to categorize.`}
                  >
                    {fragment.text}
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-gray-500 text-xs mt-4">
              💡 Click any fragment to assign it to a SPEC slot. Use Tab to navigate, Enter to select.
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Prompt Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono min-h-[120px]">
              {getPreviewText()}
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <span className={slots.S.length > 0 ? 'text-green-400' : 'text-gray-600'}>● S</span>
              <span className={slots.P.length > 0 ? 'text-green-400' : 'text-gray-600'}>● P</span>
              <span className={slots.E.length > 0 ? 'text-green-400' : 'text-gray-600'}>● E</span>
              <span className={slots.C.length > 0 ? 'text-green-400' : 'text-gray-600'}>● C</span>
            </div>
          </div>
        </div>

        {/* Fragment Selection Modal */}
        {selectedFragment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-2">Categorize this fragment:</h3>
              <p className="text-gray-300 mb-4">"{selectedFragment.text}"</p>
              
              <div className="grid grid-cols-2 gap-3">
                {specSlots.map(slot => {
                  const label = specLabels[slot];
                  return (
                    <button
                      key={slot}
                      onClick={() => moveToSlot(selectedFragment, slot)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${label.bg} ${label.border} hover:opacity-80`}
                    >
                      <span className={`font-bold ${label.color}`}>{slot} - {label.name}</span>
                      <p className="text-xs text-gray-400 mt-1">{label.desc}</p>
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setSelectedFragment(null)}
                className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SPEC Slots */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {specSlots.map(slot => {
            const label = specLabels[slot];
            const isFilled = slots[slot].length > 0;
            
            return (
              <div key={slot} className={`rounded-xl p-4 border-2 transition-all ${label.bg} ${isFilled ? 'border-opacity-100' : 'border-opacity-30'} ${label.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-lg font-bold ${label.color}`}>
                    {slot} - {label.name}
                  </h4>
                  <span className="text-xs bg-gray-900/50 px-2 py-1 rounded text-gray-400">
                    {slots[slot].length} items
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{label.desc}</p>
                
                <div className={`min-h-[100px] rounded-lg p-2 space-y-2 ${isFilled ? 'bg-gray-900/30' : 'bg-gray-900/50 border-2 border-dashed border-gray-700'}`}>
                  {slots[slot].map((fragment, i) => (
                    <button
                      key={i}
                      onClick={() => removeFromSlot(fragment, slot)}
                      className="w-full text-left bg-gray-800 hover:bg-red-900/30 rounded px-3 py-2 text-sm text-white transition-all group"
                      title="Click to remove"
                    >
                      <span className="group-hover:hidden">{fragment.text}</span>
                      <span className="hidden group-hover:inline text-red-400">✗ Click to remove</span>
                    </button>
                  ))}
                  {slots[slot].length === 0 && (
                    <div className="text-gray-600 text-sm text-center py-8">
                      <span className="block text-2xl mb-2">+</span>
                      Click fragments above to add
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleComplete}
            disabled={!allCorrect()}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              allCorrect() 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50 transform hover:scale-[1.02]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allCorrect() 
              ? `✓ Complete Lab (+${lesson.xp} XP)` 
              : `Fill all 4 SPEC slots (${Object.values(slots).flat().length}/12 placed)`
            }
          </button>
          
          {!showAnswers && (
            <button
              onClick={handleShowAnswers}
              className="px-4 py-4 bg-amber-900/30 border border-amber-500/50 text-amber-400 hover:bg-amber-900/50 rounded-xl font-bold transition-colors"
              title="Show correct answers (for learning)"
            >
              💡 Show Answers
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors"
            title="Start over"
          >
            🔄 Reset
          </button>
        </div>
        
        {!allCorrect() && Object.values(slots).flat().length > 0 && !showAnswers && (
          <p className="text-center text-amber-400 text-sm mt-3">
            ⚠️ Some fragments may be in the wrong slots. Try rearranging, or use "Show Answers" to learn.
          </p>
        )}
        
        {showAnswers && (
          <p className="text-center text-green-400 text-sm mt-3">
            ✓ Answers revealed! This is for learning - try to understand why each fragment belongs where it does.
          </p>
        )}
      </div>
    </div>
  );
}
