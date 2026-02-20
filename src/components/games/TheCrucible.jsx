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

const dimensionHelp = {
  Accuracy: {
    title: 'Accuracy',
    desc: 'Are facts, figures, and claims correct and verifiable?',
    pass: 'Data is correct, sources cited, no false claims',
    fail: 'Wrong numbers, unsubstantiated claims, factual errors'
  },
  Clarity: {
    title: 'Clarity',
    desc: 'Is the writing easy to understand with clear structure?',
    pass: 'Well-organized, precise language, logical flow',
    fail: 'Jargon-heavy, confusing structure, vague wording'
  },
  Tone: {
    title: 'Tone',
    desc: 'Is the tone appropriate for the audience and context?',
    pass: 'Professional, respectful, matches audience expectations',
    fail: 'Too casual, overly promotional, blaming, or unprofessional'
  },
  Completeness: {
    title: 'Completeness',
    desc: 'Does it include all necessary information without gaps?',
    pass: 'All key points covered, context provided, nothing missing',
    fail: 'Missing critical details, lacks context, incomplete analysis'
  }
};

const lesson = LESSONS.find(l => l.slug === 'the-crucible');

export default function TheCrucible({ lessonId, onComplete }) {
  const [ratings, setRatings] = useState(
    outputs.map(() => ({ Accuracy: null, Clarity: null, Tone: null, Completeness: null }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [helpDim, setHelpDim] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

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
          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600';
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
        {/* Tutorial */}
        {showTutorial && (
          <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h3 className="font-bold text-blue-400 mb-2">How to Evaluate AI Output</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Read the text below and evaluate it on 4 dimensions. Click the <strong>?</strong> icon on any dimension to learn what it means.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <span>✓ = PASS (meets standards)</span>
                  <span>✗ = FAIL (needs improvement)</span>
                </div>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="text-blue-400 text-sm underline hover:text-blue-300 mt-2"
                >
                  Got it, hide this
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Output {currentIndex + 1} of {outputs.length}</span>
            {showResults && <span className={correctCount >= 3 ? 'text-green-400' : 'text-amber-400'}>{correctCount}/4 correct</span>}
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Output Text */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">AI Output to Evaluate</p>
          <p className="text-gray-300 leading-relaxed italic">"{currentOutput.text}"</p>
        </div>

        {/* Dimensions */}
        <p className="text-gray-400 mb-4 text-center">
          {showResults ? 'Expert evaluation shown below:' : 'Click each dimension to rate PASS or FAIL:'}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {dimensions.map(dim => (
            <div key={dim} className="relative">
              <button
                onClick={() => toggleDimension(dim)}
                disabled={showResults}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all disabled:cursor-default
                  ${getDimensionStyle(dim)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{dim}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHelpDim(helpDim === dim ? null : dim);
                      }}
                      className="w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs hover:bg-blue-600 hover:text-white transition-colors"
                      title="What does this mean?"
                    >
                      ?
                    </button>
                  </div>
                  <span className="text-lg">
                    {currentRatings[dim] === true && '✓'}
                    {currentRatings[dim] === false && '✗'}
                    {currentRatings[dim] === null && '○'}
                  </span>
                </div>
                {showResults && (
                  <p className={`text-xs mt-2 ${currentRatings[dim] === currentOutput.expert[dim] ? 'text-green-400' : 'text-red-400'}`}>
                    {currentOutput.expert[dim] ? '✓ Expert says PASS' : '✗ Expert says FAIL'}
                  </p>
                )}
              </button>
              
              {/* Help Tooltip */}
              {helpDim === dim && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 p-4 bg-gray-900 rounded-xl border-2 border-blue-500 shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-blue-400">{dimensionHelp[dim].title}</h4>
                    <button 
                      onClick={() => setHelpDim(null)}
                      className="text-gray-500 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{dimensionHelp[dim].desc}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-400">PASS: {dimensionHelp[dim].pass}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-400">FAIL: {dimensionHelp[dim].fail}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!allRated}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            allRated 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/50 transform hover:scale-[1.02]' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {showResults 
            ? (currentIndex < outputs.length - 1 ? 'Next Output →' : 'See Final Results')
            : 'Submit Evaluation'
          }
        </button>
        
        {!allRated && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Rate all 4 dimensions to continue
          </p>
        )}

        {/* Feedback */}
        {showResults && (
          <div className="mt-6 p-4 rounded-xl border bg-gray-800/50 border-gray-600">
            <h4 className="font-bold text-white mb-2">💡 Expert Explanation</h4>
            <p className="text-gray-300 text-sm">{currentOutput.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
