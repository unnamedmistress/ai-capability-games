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

const lesson = LESSONS.find(l => l.slug === 'spec-lab');

export default function SPECLab({ lessonId, onComplete }) {
  const [slots, setSlots] = useState({ S: [], P: [], E: [], C: [] });
  const [available, setAvailable] = useState(challenges[0].fragments);
  const [isComplete, setIsComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const moveToSlot = (fragment, slot) => {
    if (slots[slot].includes(fragment)) return;
    setSlots({ ...slots, [slot]: [...slots[slot], fragment] });
    setAvailable(available.filter(f => f !== fragment));
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
              <div>
                <h3 className="font-bold text-blue-400 mb-1">How to Play</h3>
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Step 1:</strong> Read each fragment carefully.<br/>
                  <strong>Step 2:</strong> Click a fragment to assign it to a SPEC slot.<br/>
                  <strong>Step 3:</strong> Fill all 4 slots (S, P, E, C) with at least one fragment each.<br/>
                  <strong>Tip:</strong> Click a fragment in a slot to remove it if you make a mistake.
                </p>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="text-blue-400 text-sm underline hover:text-blue-300"
                >
                  Got it, hide this
                </button>
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
                    onClick={() => {
                      // Show slot selection modal or dropdown
                      const slot = prompt(`Where should "${fragment.text}" go?\n\nS = Situation\nP = Purpose\nE = Expectations\nC = Constraints`);
                      if (slot && ['S', 'P', 'E', 'C'].includes(slot.toUpperCase())) {
                        moveToSlot(fragment, slot.toUpperCase());
                      }
                    }}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white hover:border-purple-500 hover:bg-gray-800 transition-all text-left"
                  >
                    {fragment.text}
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-gray-500 text-xs mt-4">
              💡 Click any fragment to assign it to a SPEC slot
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Prompt Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono min-h-[120px]">
              {getPreviewText()}
            </div>
            <div className="mt-3 flex gap-2 text-xs text-gray-500">
              <span className={slots.S.length > 0 ? 'text-green-400' : ''}>● S</span>
              <span className={slots.P.length > 0 ? 'text-green-400' : ''}>● P</span>
              <span className={slots.E.length > 0 ? 'text-green-400' : ''}>● E</span>
              <span className={slots.C.length > 0 ? 'text-green-400' : ''}>● C</span>
            </div>
          </div>
        </div>

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

        {/* Complete Button */}
        <button
          onClick={handleComplete}
          disabled={!allCorrect()}
          className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${
            allCorrect() 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50 transform hover:scale-[1.02]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allCorrect() 
            ? `✓ Complete Lab (+${lesson.xp} XP)` 
            : `Fill all 4 SPEC slots with correct categories (${Object.values(slots).flat().length}/12 placed)`
          }
        </button>
        
        {!allCorrect() && Object.values(slots).flat().length > 0 && (
          <p className="text-center text-amber-400 text-sm mt-3">
            ⚠️ Some fragments may be in the wrong slots. Check your work!
          </p>
        )}
      </div>
    </div>
  );
}
