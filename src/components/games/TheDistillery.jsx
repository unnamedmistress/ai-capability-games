import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const scenarios = [
  {
    id: 1,
    title: 'Project Status Report',
    original: 'The Q3 migration project has encountered several challenges. Server provisioning took 2 weeks longer than estimated due to vendor delays. The database migration completed successfully with zero data loss. API integration is 80% complete but facing rate limiting issues with the third-party service. User acceptance testing revealed 12 minor UI inconsistencies that are being addressed. Performance benchmarks show 40% improvement in response times.',
    fragments: [
      { id: 1, text: 'Q3 migration project facing delays but showing strong results', type: 'sentence' },
      { id: 2, text: 'Server provisioning delayed 2 weeks', type: 'bullet' },
      { id: 3, text: 'Database migration completed successfully', type: 'bullet' },
      { id: 4, text: 'API integration at 80%', type: 'bullet' },
      { id: 5, text: '12 UI issues found in testing', type: 'bullet' },
      { id: 6, text: '40% performance improvement achieved', type: 'bullet' },
      { id: 7, text: 'Contact vendor about server delays', type: 'action' },
      { id: 8, text: 'Resolve third-party rate limiting', type: 'action' },
      { id: 9, text: 'Fix UI inconsistencies before release', type: 'action' },
      { id: 10, text: 'Zero data loss occurred', type: 'bullet' },
      { id: 11, text: 'Response times improved significantly', type: 'bullet' },
      { id: 12, text: 'Update project timeline', type: 'action' }
    ],
    requirements: { sentence: 1, bullets: 5, actions: 3 }
  },
  {
    id: 2,
    title: 'Customer Feedback Summary',
    original: 'Recent survey of 500 enterprise customers revealed key insights. 78% rated onboarding experience as excellent. The top requested feature is advanced analytics dashboard integration. Pricing concerns were raised by 23% of respondents. Customer support satisfaction increased to 92%. Mobile app usage grew 35% this quarter. Security certifications are becoming a decision factor for 60% of prospects.',
    fragments: [
      { id: 1, text: 'Customer satisfaction strong with clear growth opportunities', type: 'sentence' },
      { id: 2, text: '78% excellent onboarding rating', type: 'bullet' },
      { id: 3, text: 'Advanced analytics most requested feature', type: 'bullet' },
      { id: 4, text: '23% have pricing concerns', type: 'bullet' },
      { id: 5, text: '92% support satisfaction', type: 'bullet' },
      { id: 6, text: 'Mobile usage up 35%', type: 'bullet' },
      { id: 7, text: '60% value security certifications', type: 'bullet' },
      { id: 8, text: 'Prioritize analytics dashboard development', type: 'action' },
      { id: 9, text: 'Review pricing strategy for concerned segment', type: 'action' },
      { id: 10, text: 'Accelerate security certification process', type: 'action' },
      { id: 11, text: '500 customers surveyed', type: 'bullet' },
      { id: 12, text: 'Double down on mobile experience', type: 'action' }
    ],
    requirements: { sentence: 1, bullets: 5, actions: 3 }
  },
  {
    id: 3,
    title: 'Technical Incident Post-Mortem',
    original: 'Yesterday\'s 45-minute outage was caused by a cascading failure in the authentication service. The primary database connection pool was exhausted due to a misconfigured timeout. No customer data was lost. Recovery required manual intervention to restart services in sequence. Monitoring alerts failed to trigger because of a separate notification service issue. A total of 12,000 users were affected during peak hours.',
    fragments: [
      { id: 1, text: 'Authentication service failure caused 45-minute outage affecting 12K users', type: 'sentence' },
      { id: 2, text: 'Cascading failure in auth service', type: 'bullet' },
      { id: 3, text: 'Database connection pool exhausted', type: 'bullet' },
      { id: 4, text: 'Misconfigured timeout identified as root cause', type: 'bullet' },
      { id: 5, text: 'No data loss occurred', type: 'bullet' },
      { id: 6, text: 'Monitoring alerts failed to fire', type: 'bullet' },
      { id: 7, text: 'Manual restart required for recovery', type: 'bullet' },
      { id: 8, text: 'Fix connection pool timeout configuration', type: 'action' },
      { id: 9, text: 'Repair notification service', type: 'action' },
      { id: 10, text: 'Create automated recovery playbook', type: 'action' },
      { id: 11, text: 'Peak hours impact was significant', type: 'bullet' },
      { id: 12, text: 'Add redundant monitoring', type: 'action' }
    ],
    requirements: { sentence: 1, bullets: 5, actions: 3 }
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-distillery');

export default function TheDistillery({ lessonId, onComplete }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [sentence, setSentence] = useState(null);
  const [bullets, setBullets] = useState([]);
  const [actions, setActions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  const scenario = scenarios[scenarioIdx];
  const progress = ((scenarioIdx) / scenarios.length) * 100;

  const handleSelect = (fragment) => {
    if (showFeedback) return;
    
    if (fragment.type === 'sentence' && !sentence) {
      setSentence(fragment);
    } else if (fragment.type === 'bullet' && bullets.length < 5 && !bullets.find(b => b.id === fragment.id)) {
      setBullets([...bullets, fragment]);
    } else if (fragment.type === 'action' && actions.length < 3 && !actions.find(a => a.id === fragment.id)) {
      setActions([...actions, fragment]);
    }
  };

  const handleRemove = (type, id) => {
    if (showFeedback) return;
    if (type === 'sentence') setSentence(null);
    if (type === 'bullet') setBullets(bullets.filter(b => b.id !== id));
    if (type === 'action') setActions(actions.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    const correctSentence = sentence !== null;
    const correctBullets = bullets.filter(b => b.type === 'bullet').length >= 4;
    const correctActions = actions.filter(a => a.type === 'action').length >= 2;
    
    const allCorrect = correctSentence && correctBullets && correctActions;
    setWasCorrect(allCorrect);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (scenarioIdx < scenarios.length - 1) {
        setScenarioIdx(s => s + 1);
        setSentence(null);
        setBullets([]);
        setActions([]);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 2000);
  };

  if (isComplete) {
    const xp = wasCorrect ? lesson.xp : Math.round(lesson.xp * 0.7);
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={wasCorrect}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const canSubmit = sentence !== null && bullets.length >= 4 && actions.length >= 2;
  const usedIds = [
    sentence?.id,
    ...bullets.map(b => b.id),
    ...actions.map(a => a.id)
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={lesson}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{scenario.title} ({scenarioIdx + 1}/{scenarios.length})</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-fuchsia-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Original Text */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Original text:</p>
          <p className="text-gray-300 leading-relaxed">{scenario.original}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Target Zones */}
          <div className="space-y-4">
            {/* Sentence Zone */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">1-Sentence Summary</span>
                <span className={`text-xs ${sentence ? 'text-green-400' : 'text-gray-500'}`}>
                  {sentence ? '✓' : '0/1'}
                </span>
              </div>
              {sentence ? (
                <div 
                  onClick={() => handleRemove('sentence', sentence.id)}
                  className="p-3 bg-fuchsia-900/30 border border-fuchsia-500 rounded-lg cursor-pointer hover:bg-fuchsia-900/50"
                >
                  <p className="text-fuchsia-300 text-sm">{sentence.text}</p>
                  <p className="text-xs text-fuchsia-500 mt-1">Click to remove</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm italic">Select one summary sentence from fragments below</p>
              )}
            </div>

            {/* Bullets Zone */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">5 Key Points</span>
                <span className={`text-xs ${bullets.length >= 4 ? 'text-green-400' : 'text-gray-500'}`}>
                  {bullets.length}/5
                </span>
              </div>
              <div className="space-y-2">
                {bullets.map((b, i) => (
                  <div 
                    key={b.id}
                    onClick={() => handleRemove('bullet', b.id)}
                    className="flex items-center gap-2 p-2 bg-cyan-900/30 border border-cyan-500 rounded cursor-pointer hover:bg-cyan-900/50"
                  >
                    <span className="text-cyan-400 text-xs">{i + 1}.</span>
                    <span className="text-cyan-300 text-sm flex-1">{b.text}</span>
                  </div>
                ))}
                {bullets.length === 0 && (
                  <p className="text-gray-600 text-sm italic">Select bullet points</p>
                )}
              </div>
            </div>

            {/* Actions Zone */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">3 Action Items</span>
                <span className={`text-xs ${actions.length >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
                  {actions.length}/3
                </span>
              </div>
              <div className="space-y-2">
                {actions.map((a, i) => (
                  <div 
                    key={a.id}
                    onClick={() => handleRemove('action', a.id)}
                    className="flex items-center gap-2 p-2 bg-amber-900/30 border border-amber-500 rounded cursor-pointer hover:bg-amber-900/50"
                  >
                    <span className="text-amber-400 text-xs">□</span>
                    <span className="text-amber-300 text-sm flex-1">{a.text}</span>
                  </div>
                ))}
                {actions.length === 0 && (
                  <p className="text-gray-600 text-sm italic">Select action items</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || showFeedback}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              {showFeedback ? 'Next...' : 'Distill'}
            </button>

            {showFeedback && (
              <div className={`p-3 rounded-lg ${wasCorrect ? 'bg-green-900/30 border border-green-500' : 'bg-yellow-900/30 border border-yellow-500'}`}>
                <p className={`text-sm ${wasCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
                  {wasCorrect ? '✓ Great distillation!' : 'Good attempt - review your selections'}
                </p>
              </div>
            )}
          </div>

          {/* Fragment Pool */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Click fragments to add to zones:</p>
            <div className="flex flex-wrap gap-2">
              {scenario.fragments.map(frag => {
                const used = usedIds.includes(frag.id);
                const typeColors = {
                  sentence: 'bg-fuchsia-900/30 border-fuchsia-500 text-fuchsia-300',
                  bullet: 'bg-cyan-900/30 border-cyan-500 text-cyan-300',
                  action: 'bg-amber-900/30 border-amber-500 text-amber-300'
                };
                
                return (
                  <button
                    key={frag.id}
                    onClick={() => handleSelect(frag)}
                    disabled={used || showFeedback}
                    className={`p-2 text-sm rounded border transition-all text-left max-w-full
                      ${used 
                        ? 'bg-gray-800 border-gray-700 text-gray-600 opacity-50' 
                        : `${typeColors[frag.type]} hover:opacity-80`}`}
                  >
                    {frag.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
