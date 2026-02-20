import React, { useState, useEffect } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const paragraphs = [
  {
    id: 1,
    text: 'The new quantum processor operates at 99.9% accuracy with zero latency. Our tests show it can solve problems 1000x faster than classical computers while consuming half the power. The chip maintains stability at room temperature without any cooling requirements. Early adopters report complete satisfaction with performance exceeding all expectations.',
    claims: [
      { text: '99.9% accuracy', confidence: 'MED' },
      { text: 'zero latency', confidence: 'LOW' },
      { text: '1000x faster than classical computers', confidence: 'MED' },
      { text: 'consuming half the power', confidence: 'MED' },
      { text: 'room temperature without cooling', confidence: 'LOW' },
      { text: 'Early adopters report complete satisfaction', confidence: 'HIGH' },
      { text: 'exceeding all expectations', confidence: 'HIGH' },
      { text: 'proven in extensive testing', confidence: 'HIGH' }
    ]
  },
  {
    id: 2,
    text: 'Clinical trials demonstrated our supplement reverses aging in 90% of subjects. Participants showed DNA methylation patterns identical to 25-year-olds after just 3 months. The formula works equally well for all ethnicities and body types. Results are permanent and require no continued use. No side effects were reported in any participant.',
    claims: [
      { text: 'reverses aging in 90% of subjects', confidence: 'LOW' },
      { text: 'DNA methylation patterns identical to 25-year-olds', confidence: 'LOW' },
      { text: 'after just 3 months', confidence: 'LOW' },
      { text: 'works equally well for all ethnicities', confidence: 'MED' },
      { text: 'works for all body types', confidence: 'MED' },
      { text: 'Results are permanent', confidence: 'LOW' },
      { text: 'require no continued use', confidence: 'LOW' },
      { text: 'No side effects reported', confidence: 'MED' }
    ]
  },
  {
    id: 3,
    text: 'Our AI writing assistant produces content indistinguishable from human writers. It perfectly mimics any authorial voice and never makes factual errors. Publishers report 100% acceptance rates for AI-generated manuscripts. The system understands context and nuance better than professional editors. No human review is necessary before publication.',
    claims: [
      { text: 'indistinguishable from human writers', confidence: 'MED' },
      { text: 'perfectly mimics any authorial voice', confidence: 'LOW' },
      { text: 'never makes factual errors', confidence: 'LOW' },
      { text: '100% acceptance rates', confidence: 'LOW' },
      { text: 'understands context and nuance', confidence: 'MED' },
      { text: 'better than professional editors', confidence: 'LOW' },
      { text: 'No human review necessary', confidence: 'LOW' },
      { text: 'used by major publishers', confidence: 'HIGH' }
    ]
  },
  {
    id: 4,
    text: 'The carbon capture device removes 1 ton of CO2 daily from ambient air. It operates at zero energy cost using only solar power. Field tests prove it works equally well in all climates. The device requires no maintenance for 10 years. Governments worldwide have pre-ordered units for every household.',
    claims: [
      { text: 'removes 1 ton of CO2 daily', confidence: 'MED' },
      { text: 'zero energy cost', confidence: 'LOW' },
      { text: 'using only solar power', confidence: 'MED' },
      { text: 'works equally well in all climates', confidence: 'LOW' },
      { text: 'no maintenance for 10 years', confidence: 'LOW' },
      { text: 'Governments worldwide pre-ordered', confidence: 'HIGH' },
      { text: 'units for every household', confidence: 'LOW' },
      { text: 'proven in field tests', confidence: 'HIGH' }
    ]
  }
];

const lesson = LESSONS.find(l => l.slug === 'claim-detector');

export default function ClaimDetector({ lessonId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [labels, setLabels] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  const para = paragraphs[currentIndex];
  const progress = ((currentIndex) / paragraphs.length) * 100;

  useEffect(() => {
    if (!showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
  }, [timeLeft, showFeedback]);

  const setLabel = (idx, level) => {
    if (showFeedback) return;
    setLabels({ ...labels, [idx]: level });
  };

  const handleSubmit = () => {
    if (showFeedback) return;
    
    // Count correct labels (LOW on hallucinations, MED/HIGH on real claims)
    let correctLabels = 0;
    para.claims.forEach((claim, idx) => {
      const userLabel = labels[idx];
      if (!userLabel) return;
      
      if (claim.confidence === 'LOW' && userLabel === 'LOW') {
        correctLabels++;
      } else if (claim.confidence !== 'LOW' && userLabel !== 'LOW') {
        correctLabels++;
      }
    });
    
    if (correctLabels >= 5) {
      setCorrect(c => c + 1);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < paragraphs.length - 1) {
        setCurrentIndex(i => i + 1);
        setLabels({});
        setShowFeedback(false);
        setTimeLeft(45);
      } else {
        setIsComplete(true);
      }
    }, 3000);
  };

  if (isComplete) {
    const xp = correct >= 3 ? lesson.xp : Math.round(lesson.xp * (correct / 3));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correct >= 4}
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
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Paragraph {currentIndex + 1} of {paragraphs.length}</span>
            <span>Score: {correct}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full mb-3">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className={`text-right font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-gray-400'}`}>
            ⏱ {timeLeft}s
          </div>
        </div>

        {/* Paragraph */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-gray-300 leading-relaxed">{para.text}</p>
        </div>

        {/* Claims */}
        <div className="space-y-3 mb-6">
          {para.claims.map((claim, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border transition-all ${
                showFeedback && claim.confidence === 'LOW' && labels[idx] !== 'LOW' 
                  ? 'bg-red-900/30 border-red-500 animate-pulse' 
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-300 text-sm flex-1">
                  <span className="text-violet-400 font-bold mr-2">{idx + 1}.</span>
                  {claim.text}
                </p>
                <div className="flex gap-1">
                  {['HIGH', 'MED', 'LOW'].map(level => (
                    <button
                      key={level}
                      onClick={() => setLabel(idx, level)}
                      disabled={showFeedback}
                      className={`px-3 py-1 text-xs font-bold rounded transition-all disabled:opacity-50
                        ${labels[idx] === level 
                          ? level === 'LOW' 
                            ? 'bg-red-600 text-white' 
                            : level === 'MED'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              {showFeedback && (
                <p className={`text-xs mt-2 ${claim.confidence === 'LOW' ? 'text-red-400' : 'text-green-400'}`}>
                  {claim.confidence === 'LOW' ? '⚠️ Likely hallucination - be skeptical' : '✓ Claim appears verifiable'}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={showFeedback || Object.keys(labels).length < 5}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showFeedback ? 'Next...' : 'Submit Analysis'}
        </button>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-600 rounded"></span> HIGH confidence</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-600 rounded"></span> MED confidence</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded"></span> LOW confidence</span>
        </div>
      </div>
    </div>
  );
}
