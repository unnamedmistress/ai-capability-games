import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const decisions = [
  {
    id: 1,
    question: 'Which cloud provider should we choose?',
    options: [
      { id: 'aws', name: 'AWS', cost: 85, reliability: 95, features: 90, support: 80 },
      { id: 'azure', name: 'Azure', cost: 80, reliability: 90, features: 85, support: 85 },
      { id: 'gcp', name: 'Google Cloud', cost: 75, reliability: 85, features: 80, support: 75 }
    ],
    weights: { cost: 20, reliability: 40, features: 25, support: 15 },
    bestChoice: 'aws'
  },
  {
    id: 2,
    question: 'Which project management tool should we adopt?',
    options: [
      { id: 'jira', name: 'Jira', cost: 70, ease: 60, integration: 95, scale: 90 },
      { id: 'linear', name: 'Linear', cost: 85, ease: 95, integration: 80, scale: 75 },
      { id: 'asana', name: 'Asana', cost: 80, ease: 85, integration: 85, scale: 80 }
    ],
    weights: { cost: 15, ease: 30, integration: 25, scale: 30 },
    bestChoice: 'linear'
  }
];

const criteriaLabels = {
  cost: 'Cost Efficiency',
  reliability: 'Reliability',
  features: 'Feature Set',
  support: 'Support Quality',
  ease: 'Ease of Use',
  integration: 'Integration',
  scale: 'Scalability'
};

const lesson = LESSONS.find(l => l.slug === 'decision-arena');

export default function DecisionArena({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [weights, setWeights] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const decision = decisions[currentIdx];
  const progress = ((currentIdx) / decisions.length) * 100;

  const calculateWeightedScore = (option) => {
    let total = 0;
    let totalWeight = 0;
    Object.keys(decision.weights).forEach(key => {
      const weight = weights[key] || decision.weights[key];
      total += (option[key] || 50) * weight;
      totalWeight += weight;
    });
    return Math.round(total / totalWeight);
  };

  const handleScoreChange = (optionId, criterion, value) => {
    setScores({
      ...scores,
      [optionId]: { ...scores[optionId], [criterion]: parseInt(value) }
    });
  };

  const handleWeightChange = (criterion, value) => {
    setWeights({ ...weights, [criterion]: parseInt(value) });
  };

  const getWinner = () => {
    let bestScore = 0;
    let winner = null;
    decision.options.forEach(opt => {
      const score = calculateWeightedScore(opt);
      if (score > bestScore) {
        bestScore = score;
        winner = opt.id;
      }
    });
    return winner;
  };

  const handleSubmit = () => {
    if (showResults) {
      if (currentIdx < decisions.length - 1) {
        setCurrentIdx(i => i + 1);
        setScores({});
        setWeights({});
        setShowResults(false);
      } else {
        setIsComplete(true);
      }
      return;
    }
    setShowResults(true);
  };

  if (isComplete) {
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={lesson.xp}
        perfect={true}
        onNext={() => onComplete(lesson.xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const winner = showResults ? getWinner() : null;

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Decision {currentIdx + 1} of {decisions.length}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">{decision.question}</h2>
        </div>

        {/* Criteria Weights */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-4">Adjust criteria importance (weights):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(decision.weights).map(key => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{criteriaLabels[key]}</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[key] ?? decision.weights[key]}
                  onChange={(e) => handleWeightChange(key, e.target.value)}
                  disabled={showResults}
                  className="w-full accent-blue-500"
                />
                <span className="text-xs text-blue-400">{weights[key] ?? decision.weights[key]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Options Matrix */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400 font-normal">Option</th>
                {Object.keys(decision.weights).map(key => (
                  <th key={key} className="text-center py-2 text-gray-400 font-normal text-sm">
                    {criteriaLabels[key]}
                  </th>
                ))}
                {showResults && <th className="text-center py-2 text-gray-400 font-normal">Total</th>}
              </tr>
            </thead>
            <tbody>
              {decision.options.map(opt => {
                const total = calculateWeightedScore(opt);
                const isWinner = winner === opt.id;
                
                return (
                  <tr key={opt.id} className={`border-b border-gray-800 ${isWinner ? 'bg-blue-900/20' : ''}`}>
                    <td className="py-3 font-bold text-white">{opt.name}</td>
                    {Object.keys(decision.weights).map(key => (
                      <td key={key} className="text-center py-3">
                        {showResults ? (
                          <span className={`font-bold ${opt[key] >= 85 ? 'text-green-400' : opt[key] >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {opt[key]}
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores[opt.id]?.[key] ?? opt[key]}
                            onChange={(e) => handleScoreChange(opt.id, key, e.target.value)}
                            className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-center text-white"
                          />
                        )}
                      </td>
                    ))}
                    {showResults && (
                      <td className="text-center py-3">
                        <span className={`text-xl font-bold ${isWinner ? 'text-blue-400' : 'text-gray-400'}`}>
                          {total}
                        </span>
                        {isWinner && <span className="text-blue-400 ml-1">★</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recommendation */}
        {showResults && winner && (
          <div className="bg-blue-900/30 border border-blue-500 rounded-xl p-4 mb-6">
            <p className="text-blue-400 font-bold text-lg">
              ★ Recommended: {decision.options.find(o => o.id === winner).name}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Based on weighted criteria analysis with your priorities.
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white"
        >
          {showResults ? (currentIdx < decisions.length - 1 ? 'Next Decision →' : 'Complete') : 'Calculate Recommendation'}
        </button>
      </div>
    </div>
  );
}
