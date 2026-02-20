import React, { useState, useEffect } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const examples = [
  { vague: "Help me with something", strong: "I need a 2-page project proposal for our Q4 marketing campaign by Friday" },
  { vague: "Write about AI", strong: "I need a blog post explaining transformer architecture for software engineers by next Tuesday" },
  { vague: "Make this better", strong: "I need to improve this sales email to increase response rate for enterprise prospects by end of day" }
];

const lesson = LESSONS.find(l => l.slug === 'goal-forge');

export default function GoalForge({ lessonId, onComplete }) {
  const [fields, setFields] = useState({ need: '', for: '', by: '' });
  const [qualityTest, setQualityTest] = useState('');
  const [quality, setQuality] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showScoringInfo, setShowScoringInfo] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const calculateQuality = () => {
    let score = 0;
    const breakdown = {
      needWords: 0,
      forWords: 0,
      byWords: 0,
      properNouns: 0,
      deadline: 0,
      qualityBonus: 0
    };
    
    const { need, for: forVal, by } = fields;
    
    // Word count (max 30 pts per field)
    const needWordCount = need.split(' ').filter(w => w.length > 0).length;
    const forWordCount = forVal.split(' ').filter(w => w.length > 0).length;
    const byWordCount = by.split(' ').filter(w => w.length > 0).length;
    
    breakdown.needWords = Math.min(30, needWordCount * 3);
    breakdown.forWords = Math.min(30, forWordCount * 3);
    breakdown.byWords = Math.min(30, byWordCount * 3);
    
    score += breakdown.needWords + breakdown.forWords + breakdown.byWords;
    
    // Proper noun detection (capitalized words suggest specificity)
    const allText = `${need} ${forVal} ${by}`;
    const properNouns = allText.match(/\b[A-Z][a-z]+\b/g) || [];
    breakdown.properNouns = Math.min(15, properNouns.length * 3);
    score += breakdown.properNouns;
    
    // Date/deadline detection
    const hasDate = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|by \d|deadline|due|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(by);
    if (hasDate) {
      breakdown.deadline = 15;
      score += 15;
    }
    
    // Quality test bonus
    if (qualityTest.length > 10) {
      breakdown.qualityBonus = 15;
      score += 15;
    }
    
    const finalScore = Math.min(100, score);
    setQuality(finalScore);
    setScoreBreakdown(breakdown);
  };

  useEffect(() => {
    calculateQuality();
  }, [fields, qualityTest]);

  const handleSubmit = () => {
    if (quality >= 70) {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    if (confirm('Clear all fields and start over?')) {
      setFields({ need: '', for: '', by: '' });
      setQualityTest('');
      setQuality(0);
      setScoreBreakdown(null);
    }
  };

  if (isComplete) {
    const xp = quality >= 85 ? lesson.xp + 15 : lesson.xp;
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={quality >= 85}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  const getQualityColor = () => {
    if (quality >= 85) return 'text-green-400';
    if (quality >= 70) return 'text-yellow-400';
    if (quality >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getQualityLabel = () => {
    if (quality >= 85) return 'Excellent!';
    if (quality >= 70) return 'Good';
    if (quality >= 50) return 'Getting there';
    return 'Needs work';
  };

  const hasContent = fields.need || fields.for || fields.by;

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tutorial */}
        {showTutorial && (
          <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h3 className="font-bold text-blue-400 mb-2">How to Write Clear Goals</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Vague goals lead to vague results. Use the <strong>"I need ___, for ___, by ___"</strong> framework 
                  to give AI (and yourself) clear direction.
                </p>
                <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                  <p className="text-gray-400 text-xs mb-2">📊 How your score is calculated:</p>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Specificity: More descriptive words = more points (max 30 per field)</li>
                    <li>• Detail: Using proper nouns (names, brands) adds points</li>
                    <li>• Deadline: Including a specific date/time adds bonus points</li>
                    <li>• Quality criteria: Defining success adds bonus points</li>
                  </ul>
                </div>
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

        {/* Examples Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3"
          >
            <span>{showExamples ? '▼' : '▶'}</span>
            <span className="text-sm font-medium">See Examples: Vague vs Strong Goals</span>
          </button>
          
          {showExamples && (
            <div className="space-y-3 bg-gray-800/30 rounded-xl p-4">
              {examples.map((ex, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-red-400">❌</span>
                    <p className="text-red-400/80 line-through">{ex.vague}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <p className="text-green-400">{ex.strong}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quality Meter with Scoring Breakdown */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Goal Quality Score</span>
              <button
                onClick={() => setShowScoringInfo(!showScoringInfo)}
                className="w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs hover:bg-blue-600 hover:text-white transition-colors"
                title="How is this calculated?"
              >
                ?
              </button>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold {getQualityColor()}">{quality}</span>
              <span className="text-gray-600">/100</span>
              <p className={`text-xs {getQualityColor()}`}>{getQualityLabel()}</p>
            </div>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                quality >= 85 ? 'bg-green-500' : 
                quality >= 70 ? 'bg-yellow-500' : 
                quality >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${quality}%` }}
            />
          </div>
          
          {/* Scoring Breakdown */}
          {showScoringInfo && scoreBreakdown && (
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-gray-400 text-xs mb-2">📊 Score Breakdown:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">"I need" specificity:</span>
                  <span className="text-purple-400">+{scoreBreakdown.needWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">"for" context:</span>
                  <span className="text-purple-400">+{scoreBreakdown.forWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">"by" deadline:</span>
                  <span className="text-purple-400">+{scoreBreakdown.byWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Detail (proper nouns):</span>
                  <span className="text-purple-400">+{scoreBreakdown.properNouns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date specified:</span>
                  <span className="text-purple-400">+{scoreBreakdown.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Success criteria:</span>
                  <span className="text-purple-400">+{scoreBreakdown.qualityBonus}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2 italic">
                💡 Tip: Add more descriptive words, specific names, and clear deadlines to increase your score.
              </p>
            </div>
          )}
          
          {quality >= 70 && (
            <div className="mt-3 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              <p className="text-green-400 text-sm text-center">
                ✓ Quality threshold reached! You can submit now.
              </p>
            </div>
          )}
          
          {quality < 70 && hasContent && (
            <div className="mt-3 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
              <p className="text-amber-400 text-sm">
                💡 {70 - quality} more points needed. Try adding:
                {fields.need.split(' ').filter(w => w.length > 0).length < 5 && ' more detail to "I need"'}
                {fields.for.split(' ').filter(w => w.length > 0).length < 5 && ', more context to "for"'}
                {fields.by.split(' ').filter(w => w.length > 0).length < 3 && ', a specific deadline to "by"'}
              </p>
            </div>
          )}
        </div>

        {/* Goal Form */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">
              I need <span className="text-gray-500 text-sm">(what deliverable?)</span>
            </label>
            <input
              type="text"
              value={fields.need}
              onChange={(e) => setFields({...fields, need: e.target.value})}
              placeholder="e.g., a 2-page project proposal with budget estimates"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-gray-500 text-xs mt-2">
              Be specific about format (email, report, list) and length
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">
              for <span className="text-gray-500 text-sm">(who/what purpose?)</span>
            </label>
            <input
              type="text"
              value={fields.for}
              onChange={(e) => setFields({...fields, for: e.target.value})}
              placeholder="e.g., our Q4 marketing campaign targeting enterprise clients"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-gray-500 text-xs mt-2">
              Include audience and context so the tone is appropriate
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">
              by <span className="text-gray-500 text-sm">(when/deadline?)</span>
            </label>
            <input
              type="text"
              value={fields.by}
              onChange={(e) => setFields({...fields, by: e.target.value})}
              placeholder="e.g., Friday at 5pm for the board meeting"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-gray-500 text-xs mt-2">
              Specific dates help with urgency and scope (+15 bonus points!)
            </p>
          </div>
        </div>

        {/* Quality Test Bonus */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={qualityTest.length > 0}
              onChange={(e) => setQualityTest(e.target.checked ? 'It will be successful if ' : '')}
              className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <div className="flex-1">
              <span className="text-gray-300 font-medium">Add success criteria (+15 XP bonus)</span>
              <p className="text-gray-500 text-xs">Define what "good" looks like</p>
              {qualityTest.length > 0 && (
                <input
                  type="text"
                  value={qualityTest}
                  onChange={(e) => setQualityTest(e.target.value)}
                  placeholder="It will be successful if..."
                  className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
              )}
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={quality < 70}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              quality >= 70 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50 transform hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {quality >= 70 
              ? `✓ Forge Goal (+${quality >= 85 ? lesson.xp + 15 : lesson.xp} XP)` 
              : `Need ${70 - quality} more quality points`
            }
          </button>
          
          {hasContent && (
            <button
              onClick={handleReset}
              className="px-4 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-colors"
              title="Clear all fields"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
