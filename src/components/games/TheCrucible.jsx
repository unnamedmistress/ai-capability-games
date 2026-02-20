import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const outputs = [
  {
    id: 1,
    text: 'The Q3 revenue increased 15% year-over-year, driven primarily by enterprise sales. Customer acquisition costs decreased by 8% while lifetime value improved. However, churn rate in the SMB segment rose 2%, requiring attention in Q4 strategic planning.',
    expert: { Accuracy: true, Clarity: true, Tone: true, Completeness: true },
    explanation: 'Accurate figures, clear structure, professional tone, includes both positive and negative metrics.'
  },
  {
    id: 2,
    text: 'Our product is the best in the market and customers absolutely love it. The new features we added are amazing and everyone should use them immediately. Sales are through the roof!',
    expert: { Accuracy: false, Clarity: false, Tone: false, Completeness: false },
    explanation: 'No specific data, overly promotional tone, vague claims, missing concrete metrics or analysis.'
  },
  {
    id: 3,
    text: 'Server response times averaged 245ms in October, within acceptable thresholds. Error rates remained stable at 0.01%. The migration to new infrastructure is 80% complete and on schedule.',
    expert: { Accuracy: true, Clarity: true, Tone: true, Completeness: true },
    explanation: 'Specific metrics provided, clear statement, professional tone, includes status and progress.'
  },
  {
    id: 4,
    text: 'The project failed because the team did not work hard enough. Deadlines were missed repeatedly and deliverables were subpar. Management needs to address these serious performance issues immediately.',
    expert: { Accuracy: false, Clarity: true, Tone: false, Completeness: false },
    explanation: 'Makes subjective accusations without evidence, blaming tone, lacks root cause analysis or constructive framing.'
  }
];

const dimensions = ['Accuracy', 'Clarity', 'Tone', 'Completeness'];

const lesson = LESSONS.find(l => l.slug === 'the-crucible');

export default function TheCrucible({ lessonId, onComplete }) {
  const [ratings, setRatings] = useState(
    outputs.map(() => ({ Accuracy: null, Clarity: null, Tone: null, Completeness: null }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentOutput = outputs[currentIndex];
  const currentRatings = ratings[currentIndex];
  const progress = ((currentIndex) / outputs.length) * 100;

  const toggleDimension = (dim) => {
    if (showResults) return;
    setRatings(ratings.map((r, i) => 
      i === currentIndex 
        ? { ...r, [dim]: r[dim] === null ? true : r[dim] === true ? false : null }
        : r
    ));
  };

  const getDimensionStyle = (dim) => {
    const val = currentRatings[dim];
    const expertVal = currentOutput.expert[dim];
    
    if (!showResults) {
      return val === true 
        ? 'bg-green-900/30 border-green-500 text-green-400'
        : val === false
          ? 'bg-red-900/30 border-red-500 text-red-400'
          : 'bg-gray-800 border-gray-700 text-gray-400';
    }
    
    // Show feedback
    if (val === expertVal) {
      return 'bg-green-900/30 border-green-500 text-green-400';
    }
    return 'bg-red-900/30 border-red-500 text-red-400';
  };

  const handleSubmit = () => {
    if (showResults) {
      if (currentIndex < outputs.length - 1) {
        setCurrentIndex(i => i + 1);
        setShowResults(false);
      } else {
        setIsComplete(true);
      }
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    outputs.forEach((output, i) => {
      dimensions.forEach(dim => {
        total++;
        if (ratings[i][dim] === output.expert[dim]) {
          correct++;
        }
      });
    });
    return Math.round((correct / total) * 100);
  };

  if (isComplete) {
    const score = calculateScore();
    const xp = score >= 70 ? lesson.xp : Math.round(lesson.xp * (score / 100));
    
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={score >= 90}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const allRated = dimensions.every(d => currentRatings[d] !== null);
  const correctCount = dimensions.filter(d => currentRatings[d] === currentOutput.expert[d]).length;

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
            <span>Output {currentIndex + 1} of {outputs.length}</span>
            {showResults && <span>{correctCount}/4 dimensions correct</span>}
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Output Text */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-gray-300 leading-relaxed italic">"{currentOutput.text}"</p>
        </div>

        {/* Dimensions */}
        <p className="text-gray-400 mb-4 text-center">
          {showResults ? 'Expert rubric shown below:' : 'Toggle PASS (✓) or FAIL (✗) for each dimension:'}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {dimensions.map(dim => (
            <button
              key={dim}
              onClick={() => toggleDimension(dim)}
              disabled={showResults}
              className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-default
                ${getDimensionStyle(dim)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{dim}</span>
                {currentRatings[dim] === true && <span>✓</span>}
                {currentRatings[dim] === false && <span>✗</span>}
                {currentRatings[dim] === null && <span className="text-gray-600">?</span>}
              </div>
              {showResults && (
                <p className="text-xs mt-2 opacity-80">
                  {currentOutput.expert[dim] ? 'Expert: PASS' : 'Expert: FAIL'}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!allRated}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showResults 
            ? (currentIndex < outputs.length - 1 ? 'Next Output →' : 'See Results')
            : 'Submit Evaluation'
          }
        </button>

        {/* Feedback */}
        {showResults && (
          <div className="mt-6 p-4 rounded-xl border bg-gray-800/50 border-gray-600">
            <p className="text-gray-300 text-sm">{currentOutput.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
