import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const tasks = [
  { 
    id: 1, 
    optimalChunks: 2, 
    description: 'Organize quarterly research findings for executive presentation',
    text: 'Q1 Market Research: Consumer behavior shifted 15% toward sustainable products. Competitor analysis reveals three new entrants with aggressive pricing. Supply chain disruptions affected 23% of SKUs. Customer satisfaction scores improved in digital channels but declined in physical retail. Partnership opportunities identified in APAC region. Regulatory changes pending in EU markets. Budget reallocation needed for Q2 initiatives.',
    explanation: 'Research findings have two natural groups: findings (behavior, competitors, supply chain, satisfaction) and actions/opportunities (partnerships, regulatory, budget).'
  },
  { 
    id: 2, 
    optimalChunks: 3, 
    description: 'Structure project onboarding for new engineering hires',
    text: 'Week 1: Setup development environment, access provisioning, codebase walkthrough. Week 2: First ticket assignment with mentor pairing, team introductions, architecture overview. Week 3: Independent ticket work, code review participation, documentation contributions. Week 4: First production deployment, retrospective feedback, goal setting for month 2.',
    explanation: 'Onboarding splits into: Setup & Access, Learning & Mentoring, and Independent Contribution.'
  },
  { 
    id: 3, 
    optimalChunks: 3, 
    description: 'Break down strategic planning meeting agenda',
    text: 'Review Q3 performance metrics and variance analysis. Discuss market expansion opportunities in LATAM and Southeast Asia. Address resource constraints in engineering and customer success. Approve budget revisions for marketing automation initiative. Plan executive offsite for Q4 strategy alignment. Update board presentation timeline and assign deliverables.',
    explanation: 'Meeting agenda: Review → Discussion/Planning → Actions & Assignments.'
  },
  { 
    id: 4, 
    optimalChunks: 4, 
    description: 'Structure complex incident response procedure',
    text: 'Detection: Monitor alerts from SIEM, cloud infrastructure, and application logs. Triage: Classify severity (P0-P3), assign incident commander, create war room channel. Containment: Isolate affected systems, preserve forensic evidence, implement temporary workarounds. Resolution: Deploy permanent fix, conduct post-mortem, update runbooks, communicate to stakeholders.',
    explanation: 'Incident response follows a 4-phase lifecycle: Detection → Triage → Containment → Resolution.'
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-chunker');

export default function TheChunker({ lessonId, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const task = tasks[currentIndex];
  const progress = ((currentIndex) / tasks.length) * 100;

  const handleSelect = (chunks) => {
    if (showFeedback) return;
    
    setSelected(chunks);
    const isRight = chunks === task.optimalChunks;
    setWasCorrect(isRight);
    
    if (isRight) {
      setCorrect(c => c + 1);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < tasks.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelected(3);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 2500);
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

  const cognitiveLoad = selected < task.optimalChunks ? 'high' : selected > task.optimalChunks ? 'fragmented' : 'optimal';

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
            <span>Task {currentIndex + 1} of {tasks.length}</span>
            <span>Score: {correct}/{currentIndex + (showFeedback ? 1 : 0)}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Task:</p>
          <p className="text-lg text-white font-medium mb-4">{task.description}</p>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">{task.text}</p>
          </div>
        </div>

        {/* Chunk Slider */}
        <p className="text-gray-400 mb-4 text-center">How many chunks should this be divided into?</p>
        
        <div className="mb-6">
          <input
            type="range"
            min="1"
            max="6"
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value))}
            disabled={showFeedback}
            className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <span key={n} className={selected === n ? 'text-pink-400 font-bold' : ''}>{n}</span>
            ))}
          </div>
        </div>

        {/* Visual Separator Preview */}
        <div className="bg-gray-800/30 rounded-xl p-4 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Preview with {selected} chunk{selected > 1 ? 's' : ''}:</p>
          <div className="flex gap-1">
            {Array(selected).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-12 rounded-lg flex items-center justify-center text-xs font-bold
                  ${cognitiveLoad === 'optimal' ? 'bg-green-900/30 border-2 border-green-500 text-green-400' :
                    cognitiveLoad === 'high' ? 'bg-red-900/30 border-2 border-red-500 text-red-400' :
                    'bg-yellow-900/30 border-2 border-yellow-500 text-yellow-400'}`}
              >
                {cognitiveLoad === 'optimal' ? '✓' : cognitiveLoad === 'high' ? '⚠' : '⋯'}
              </div>
            ))}
          </div>
          <p className={`text-xs mt-2 text-center font-medium
            ${cognitiveLoad === 'optimal' ? 'text-green-400' :
              cognitiveLoad === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>
            {cognitiveLoad === 'optimal' ? 'Optimal chunking' :
             cognitiveLoad === 'high' ? 'OVERLOAD: Too much per chunk' : 'FRAGMENTATION: Too many small chunks'}
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleSelect(selected)}
          disabled={showFeedback}
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-bold text-white disabled:opacity-50"
        >
          {showFeedback ? 'Next...' : 'Submit'}
        </button>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl border ${wasCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
            <p className={`font-bold mb-2 ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? '✓ Optimal chunking!' : `✗ Optimal was ${task.optimalChunks} chunks`}
            </p>
            <p className="text-gray-300 text-sm">{task.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
