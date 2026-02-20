import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const outputsToReview = [
  {
    id: 1,
    text: 'The new quantum processor operates at 99.9% accuracy with zero latency. Our tests show it can solve problems 1000x faster than classical computers while consuming half the power. Early adopters report complete satisfaction.',
    issues: [
      { type: 'hallucination', text: '99.9% accuracy with zero latency', explanation: 'Zero latency is physically impossible' },
      { type: 'hallucination', text: '1000x faster', explanation: 'No benchmark or context provided' },
      { type: 'bias', text: 'Early adopters report complete satisfaction', explanation: 'Unverified claim, selection bias' }
    ]
  },
  {
    id: 2,
    text: 'According to a 2023 study by McKinsey, 73% of companies implementing AI saw productivity gains within 6 months. However, the study notes that measuring productivity in knowledge work remains challenging and results vary significantly by industry.',
    issues: [
      { type: 'assumption', text: 'McKinsey study cited', explanation: 'Source attribution present - verify if accurate' },
      { type: 'nuance', text: 'measuring productivity remains challenging', explanation: 'Appropriate uncertainty acknowledged' }
    ]
  }
];

const issueTypes = {
  hallucination: { label: 'Hallucination', color: 'bg-red-600', icon: '🔮' },
  bias: { label: 'Bias', color: 'bg-yellow-600', icon: '⚖️' },
  assumption: { label: 'Assumption', color: 'bg-orange-600', icon: '🤔' },
  nuance: { label: 'Nuance/OK', color: 'bg-green-600', icon: '✓' }
};

const lesson = LESSONS.find(l => l.slug === 'skeptics-gauntlet');

export default function SkepticsGauntlet({ lessonId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [labels, setLabels] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);

  const output = outputsToReview[currentIdx];

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length > 5) {
      setSelectionStart(text);
    }
  };

  const handleLabel = (type) => {
    if (!selectionStart) return;
    
    setLabels([...labels, { text: selectionStart, type }]);
    setSelectionStart(null);
    window.getSelection().removeAllRanges();
  };

  const handleSubmit = () => {
    if (showFeedback) {
      if (currentIdx < outputsToReview.length - 1) {
        setCurrentIdx(i => i + 1);
        setLabels([]);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
      return;
    }

    // Score based on finding actual issues
    let found = 0;
    output.issues.forEach(issue => {
      const foundIssue = labels.some(l => 
        l.text.toLowerCase().includes(issue.text.toLowerCase().slice(0, 10)) ||
        issue.text.toLowerCase().includes(l.text.toLowerCase().slice(0, 10))
      );
      if (foundIssue) found++;
    });
    
    setCorrect(c => c + found);
    setShowFeedback(true);
  };

  if (isComplete) {
    const xp = correct >= 3 ? lesson.xp : Math.round(lesson.xp * (correct / 4));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 5}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Output {currentIdx + 1} of {outputsToReview.length}</span>
            <span>Issues found: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(currentIdx / outputsToReview.length) * 100}%` }} />
          </div>
        </div>

        <p className="text-gray-400 text-center mb-4">
          Select text to highlight issues, then label them.
        </p>

        {/* Text Display */}
        <div 
          className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700 cursor-text select-text"
          onMouseUp={handleTextSelect}
        >
          <p className="text-gray-300 leading-relaxed">{output.text}</p>
        </div>

        {/* Selection Label */}
        {selectionStart && (
          <div className="bg-violet-900/30 border border-violet-500 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Selected: "{selectionStart.slice(0, 50)}..."</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(issueTypes).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => handleLabel(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold text-white ${info.color} hover:opacity-80`}
                >
                  {info.icon} {info.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Found Issues */}
        {labels.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Issues you've flagged:</p>
            <div className="space-y-2">
              {labels.map((label, i) => (
                <div key={i} className={`p-3 rounded-lg border ${issueTypes[label.type].color.replace('bg-', 'border-')} bg-opacity-20`}>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${issueTypes[label.type].color} mr-2`}>
                    {issueTypes[label.type].icon} {issueTypes[label.type].label}
                  </span>
                  <span className="text-gray-300 text-sm">"{label.text.slice(0, 60)}..."</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="mb-6 p-4 rounded-xl border bg-gray-800 border-gray-600">
            <p className="text-white font-bold mb-3">Expert Analysis:</p>
            {output.issues.map((issue, i) => (
              <div key={i} className="mb-2 p-2 bg-gray-900/50 rounded">
                <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${issueTypes[issue.type]?.color || 'bg-gray-600'} mr-2`}>
                  {issueTypes[issue.type]?.icon || '?'} {issueTypes[issue.type]?.label || issue.type}
                </span>
                <span className="text-gray-400 text-sm">{issue.text}</span>
                <p className="text-gray-500 text-xs mt-1">{issue.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={labels.length === 0 && !showFeedback}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showFeedback ? (currentIdx < outputsToReview.length - 1 ? 'Next Output →' : 'Complete') : 'Submit Analysis'}
        </button>
      </div>
    </div>
  );
}
