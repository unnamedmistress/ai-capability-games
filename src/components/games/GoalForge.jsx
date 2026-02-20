import React, { useState, useEffect } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';

const examples = [
  { vague: "Help me with something", strong: "I need a 2-page project proposal for our Q4 marketing campaign by Friday" },
  { vague: "Write about AI", strong: "I need a blog post explaining transformer architecture for software engineers by next Tuesday" },
  { vague: "Make this better", strong: "I need to improve this sales email to increase response rate for enterprise prospects by end of day" }
];

export default function GoalForge({ lessonId, onComplete }) {
  const [fields, setFields] = useState({ need: '', for: '', by: '' });
  const [qualityTest, setQualityTest] = useState('');
  const [quality, setQuality] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const calculateQuality = () => {
    let score = 0;
    const { need, for: forVal, by } = fields;
    
    // Word count (max 30 pts per field)
    score += Math.min(30, need.split(' ').length * 3);
    score += Math.min(30, forVal.split(' ').length * 3);
    score += Math.min(30, by.split(' ').length * 3);
    
    // Proper noun detection (capitalized words)
    const allText = `${need} ${forVal} ${by}`;
    const properNouns = allText.match(/\b[A-Z][a-z]+\b/g) || [];
    score += Math.min(15, properNouns.length * 3);
    
    // Date/deadline detection
    const hasDate = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|by \d|deadline|due)\b/i.test(by);
    if (hasDate) score += 15;
    
    // Quality test bonus
    if (qualityTest.length > 10) score += 15;
    
    setQuality(Math.min(100, score));
  };

  useEffect(() => {
    calculateQuality();
  }, [fields, qualityTest]);

  const handleSubmit = () => {
    if (quality >= 70) {
      const xp = quality >= 85 ? 115 : quality >= 70 ? 100 : 85;
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <CompletionScreen
        lesson={{ 
          title: 'Goal Forge', 
          metacognition: 'Would someone else understand my goal without additional explanation?',
          pitfall: 'Vague goals like "make this better" or "help me with something."'
        }}
        xpEarned={quality >= 85 ? 115 : 100}
        perfect={quality >= 85}
        onNext={() => onComplete(quality >= 85 ? 115 : 100)}
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

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader 
        lesson={{ title: 'Goal Forge', step: 'Step 2: Define success', layer: 'Foundation', icon: '⚒️' }}
        onBack={() => window.history.back()}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Goal Quality</span>
            <span className={`text-2xl font-bold ${getQualityColor()}`}>{quality}/100</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${quality >= 70 ? 'bg-green-500' : quality >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${quality}%` }}
            />
          </div>
          {quality >= 70 && (
            <p className="text-green-400 text-sm mt-2 text-center">✓ Quality threshold reached!</p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">I need ___</label>
            <input
              type="text"
              value={fields.need}
              onChange={(e) => setFields({...fields, need: e.target.value})}
              placeholder="a 2-page project proposal..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">for ___</label>
            <input
              type="text"
              value={fields.for}
              onChange={(e) => setFields({...fields, for: e.target.value})}
              placeholder="our Q4 marketing campaign..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <label className="block text-purple-300 font-medium mb-2">by ___</label>
            <input
              type="text"
              value={fields.by}
              onChange={(e) => setFields({...fields, by: e.target.value})}
              placeholder="Friday at 5pm..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={qualityTest.length > 0}
              onChange={(e) => setQualityTest(e.target.checked ? 'It will be good if ' : '')}
              className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
            />
            <div className="flex-1">
              <span className="text-gray-300 font-medium">Quality test (optional +15 XP)</span>
              {qualityTest.length > 0 && (
                <input
                  type="text"
                  value={qualityTest}
                  onChange={(e) => setQualityTest(e.target.value)}
                  placeholder="It will be good if..."
                  className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                />
              )}
            </div>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={quality < 70}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            quality >= 70 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {quality >= 70 ? 'Forge Goal (+100 XP)' : `Need ${70 - quality} more quality points`}
        </button>

        <button
          onClick={() => setShowHints(!showHints)}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-400 text-sm"
        >
          {showHints ? 'Hide' : 'Show'} Examples
        </button>

        {showHints && (
          <div className="mt-4 space-y-3">
            <p className="text-gray-400 text-sm">Vague → Strong Examples:</p>
            {examples.map((ex, i) => (
              <div key={i} className="bg-gray-800/30 rounded-lg p-3 text-sm">
                <p className="text-red-400 line-through">{ex.vague}</p>
                <p className="text-green-400">{ex.strong}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
