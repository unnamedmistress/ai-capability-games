import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';

const specSlots = ['S', 'P', 'E', 'C'];
const specLabels = {
  S: 'Situation - What is the context?',
  P: 'Purpose - What do you want to achieve?',
  E: 'Expectations - What should the output look like?',
  C: 'Constraints - What are the limitations?'
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

export default function SPECLab({ lessonId, onComplete }) {
  const [slots, setSlots] = useState({ S: [], P: [], E: [], C: [] });
  const [available, setAvailable] = useState(challenges[0].fragments);
  const [isComplete, setIsComplete] = useState(false);

  const moveToSlot = (fragment, slot) => {
    if (slots[slot].includes(fragment)) return;
    setSlots({ ...slots, [slot]: [...slots[slot], fragment] });
    setAvailable(available.filter(f => f !== fragment));
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
    const xp = correct ? 100 : 75;
    setIsComplete(true);
  };

  if (isComplete) {
    const allCorrect = Object.entries(slots).every(([slot, fragments]) => 
      fragments.every(f => f.slot === slot)
    );
    return (
      <CompletionScreen
        lesson={{ 
          title: 'SPEC Lab', 
          metacognition: 'Which SPEC component was I missing in my last prompt?',
          pitfall: 'Writing prompts as single long sentences without clear structure.'
        }}
        xpEarned={allCorrect ? 100 : 75}
        perfect={allCorrect}
        onNext={() => onComplete(allCorrect ? 100 : 75)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const getPreviewText = () => {
    const hasAll = Object.values(slots).every(arr => arr.length > 0);
    if (!hasAll) return "[SPEC incomplete - fill all slots for clean preview]";
    return `Context: ${slots.S.map(f => f.text).join(', ')}
Goal: ${slots.P.map(f => f.text).join(', ')}
Format: ${slots.E.map(f => f.text).join(', ')}
Limits: ${slots.C.map(f => f.text).join(', ')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={{ title: 'SPEC Lab', step: 'Step 3: Use SPEC framework', layer: 'Foundation', icon: '🧪' }}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available fragments */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Fragments</h3>
            <p className="text-gray-400 text-sm mb-3">Drag to the correct SPEC slot</p>
            <div className="flex flex-wrap gap-2">
              {available.map((fragment, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white cursor-pointer hover:border-purple-500 transition-colors"
                >
                  {fragment.text}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
            <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {getPreviewText()}
            </pre>
          </div>
        </div>

        {/* SPEC Slots */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {specSlots.map(slot => (
            <div key={slot} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h4 className="text-lg font-bold mb-1" style={{ color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][specSlots.indexOf(slot)] }}>
                {slot} - {specLabels[slot].split(' - ')[0]}
              </h4>
              <p className="text-xs text-gray-500 mb-3">{specLabels[slot].split(' - ')[1]}</p>
              <div className="min-h-[100px] bg-gray-900/50 rounded-lg p-2 space-y-2">
                {slots[slot].map((fragment, i) => (
                  <div
                    key={i}
                    onClick={() => removeFromSlot(fragment, slot)}
                    className="bg-gray-800 rounded px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-700"
                  >
                    {fragment.text}
                  </div>
                ))}
                {slots[slot].length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-8">Click fragments above to add</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          disabled={!allCorrect()}
          className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${
            allCorrect() 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {allCorrect() ? 'Complete Lab (+100 XP)' : 'Fill all SPEC slots correctly'}
        </button>
      </div>
    </div>
  );
}
