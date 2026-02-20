import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const bombScenarios = [
  {
    id: 1,
    complexity: 'LOW',
    wires: 3,
    steps: 3,
    correctOrder: [1, 2, 3]
  },
  {
    id: 2,
    complexity: 'MED',
    wires: 5,
    steps: 5,
    correctOrder: [1, 3, 2, 4, 5]
  },
  {
    id: 3,
    complexity: 'HIGH',
    wires: 8,
    steps: 6,
    correctOrder: [1, 2, 4, 3, 5, 6]
  }
];

const wireColors = ['red', 'blue', 'green', 'yellow', 'white', 'black', 'orange', 'purple'];

const lesson = LESSONS.find(l => l.slug === 'the-decomposer');

export default function TheDecomposer({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepCount, setStepCount] = useState(3);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');

  const scenario = bombScenarios[currentIdx];

  const handleStepCount = (count) => {
    setStepCount(count);
    setSelectedSteps([]);
    setMessage('');
  };

  const handleWireCut = (wireIdx) => {
    if (selectedSteps.includes(wireIdx)) {
      setSelectedSteps(selectedSteps.filter(s => s !== wireIdx));
    } else if (selectedSteps.length < stepCount) {
      setSelectedSteps([...selectedSteps, wireIdx]);
    }
  };

  const handleDefuse = () => {
    setAttempts(a => a + 1);
    
    // Check if number of steps is correct
    if (stepCount !== scenario.steps) {
      setMessage(`Wrong step count! This requires exactly ${scenario.steps} steps.`);
      setSelectedSteps([]);
      return;
    }

    // Check if order is correct
    const isCorrectOrder = selectedSteps.every((step, idx) => step === scenario.correctOrder[idx] - 1);
    
    if (isCorrectOrder && selectedSteps.length === scenario.steps) {
      if (currentIdx < bombScenarios.length - 1) {
        setCurrentIdx(i => i + 1);
        setStepCount(3);
        setSelectedSteps([]);
        setMessage('');
      } else {
        setIsComplete(true);
      }
    } else {
      setMessage('Wrong order! Think about dependencies between steps.');
      setSelectedSteps([]);
    }
  };

  if (isComplete) {
    const xp = attempts <= 5 ? lesson.xp : Math.round(lesson.xp * 0.7);
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={attempts <= 5}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Bomb {currentIdx + 1} of {bombScenarios.length}</span>
            <span>Attempts: {attempts}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(currentIdx / bombScenarios.length) * 100}%` }} />
          </div>
        </div>

        {/* Bomb Display */}
        <div className="bg-black rounded-2xl p-8 mb-6 border-4 border-red-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <span className="text-red-500 text-4xl">💣</span>
              <p className="text-red-400 font-mono mt-2">COMPLEXITY: {scenario.complexity}</p>
            </div>

            {/* Wires */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {Array(scenario.wires).fill(0).map((_, i) => {
                const isSelected = selectedSteps.includes(i);
                const order = selectedSteps.indexOf(i);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleWireCut(i)}
                    className={`w-12 h-24 rounded-lg border-2 transition-all relative
                      ${isSelected ? 'opacity-50 border-dashed' : 'hover:scale-105'}
                      ${wireColors[i] === 'red' ? 'bg-red-600 border-red-400' :
                        wireColors[i] === 'blue' ? 'bg-blue-600 border-blue-400' :
                        wireColors[i] === 'green' ? 'bg-green-600 border-green-400' :
                        wireColors[i] === 'yellow' ? 'bg-yellow-500 border-yellow-300' :
                        wireColors[i] === 'white' ? 'bg-gray-200 border-white' :
                        wireColors[i] === 'black' ? 'bg-gray-800 border-gray-600' :
                        wireColors[i] === 'orange' ? 'bg-orange-500 border-orange-300' :
                        'bg-purple-600 border-purple-400'}`}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                        {order + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Counter */}
            <div className="bg-red-950/50 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm mb-2">How many steps to defuse?</p>
              <div className="flex justify-center gap-2">
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button
                    key={n}
                    onClick={() => handleStepCount(n)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all
                      ${stepCount === n 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Order */}
            {selectedSteps.length > 0 && (
              <div className="text-center mb-4">
                <p className="text-gray-400 text-sm mb-2">Cut order:</p>
                <div className="flex justify-center gap-2">
                  {selectedSteps.map((step, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className="text-center p-3 bg-red-900/50 rounded-lg mb-4">
                <p className="text-red-400">{message}</p>
              </div>
            )}

            {/* Defuse Button */}
            <button
              onClick={handleDefuse}
              disabled={selectedSteps.length === 0}
              className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl font-bold text-white text-xl animate-pulse"
            >
              ⚠️ DEFUSE BOMB ⚠️
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-center text-sm">
          Hint: Complex problems need the right number of steps, in the right order.
        </p>
      </div>
    </div>
  );
}
