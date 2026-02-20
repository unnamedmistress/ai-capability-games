import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const brainstormingScenarios = [
  {
    id: 1,
    topic: 'New Product Feature',
    ideas: [
      { id: 1, text: 'Dark mode for the dashboard', category: 'ui' },
      { id: 2, text: 'AI-powered auto-complete', category: 'ai' },
      { id: 3, text: 'Mobile app redesign', category: 'ui' },
      { id: 4, text: 'Smart notification system', category: 'ai' },
      { id: 5, text: 'Keyboard shortcuts', category: 'ux' },
      { id: 6, text: 'Predictive analytics', category: 'ai' },
      { id: 7, text: 'Drag-and-drop interface', category: 'ui' },
      { id: 8, text: 'Voice commands', category: 'ai' },
      { id: 9, text: 'Offline mode', category: 'ux' },
      { id: 10, text: 'Custom themes', category: 'ui' },
      { id: 11, text: 'Machine learning insights', category: 'ai' },
      { id: 12, text: 'Quick actions menu', category: 'ux' }
    ],
    topPicks: [2, 6, 9] // AI autocomplete, Predictive analytics, Offline mode
  }
];

const categoryColors = {
  ui: 'bg-blue-900/30 border-blue-500 text-blue-300',
  ai: 'bg-purple-900/30 border-purple-500 text-purple-300',
  ux: 'bg-green-900/30 border-green-500 text-green-300'
};

const categoryLabels = {
  ui: 'UI Enhancement',
  ai: 'AI Feature',
  ux: 'UX Improvement'
};

const lesson = LESSONS.find(l => l.slug === 'idea-funnel');

export default function IdeaFunnel({ lessonId, onComplete }) {
  const [phase, setPhase] = useState('brainstorm'); // brainstorm, cluster, converge, complete
  const [clustered, setClustered] = useState({});
  const [selected, setSelected] = useState([]);
  const [clusterNames, setClusterNames] = useState({});
  const scenario = brainstormingScenarios[0];

  const handleCluster = (ideaId, category) => {
    setClustered({ ...clustered, [ideaId]: category });
  };

  const allClustered = Object.keys(clustered).length === scenario.ideas.length;

  const handleConverge = (ideaId) => {
    if (selected.includes(ideaId)) {
      setSelected(selected.filter(id => id !== ideaId));
    } else if (selected.length < 3) {
      setSelected([...selected, ideaId]);
    }
  };

  const handleComplete = () => {
    const correctPicks = selected.filter(id => scenario.topPicks.includes(id)).length;
    const xp = correctPicks >= 2 ? lesson.xp : Math.round(lesson.xp * (correctPicks / 3));
    
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={correctPicks >= 2}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  };

  if (phase === 'complete') {
    return handleComplete();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {['brainstorm', 'cluster', 'converge'].map((p, i) => (
              <div key={p} className={`px-4 py-1 rounded-full text-sm font-bold
                ${phase === p ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {i + 1}. {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div className="text-center mb-8">
          <span className="text-teal-400 text-sm font-bold tracking-wider">TOPIC</span>
          <h2 className="text-2xl font-bold text-white mt-1">{scenario.topic}</h2>
        </div>

        {phase === 'brainstorm' && (
          <>
            <p className="text-gray-400 text-center mb-6">
              First, let's cluster these ideas into categories. Click each idea to categorize it.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {scenario.ideas.map(idea => (
                <div key={idea.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 text-sm mb-3">{idea.text}</p>
                  <div className="flex gap-1">
                    {Object.keys(categoryColors).map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCluster(idea.id, cat)}
                        className={`flex-1 py-1 text-xs rounded border transition-all
                          ${clustered[idea.id] === cat 
                            ? categoryColors[cat] 
                            : 'bg-gray-700 text-gray-500 border-gray-600 hover:bg-gray-600'}`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase('cluster')}
              disabled={!allClustered}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              Continue to Cluster Naming →
            </button>
          </>
        )}

        {phase === 'cluster' && (
          <>
            <p className="text-gray-400 text-center mb-6">
              Name each cluster based on the common theme.
            </p>
            
            <div className="space-y-4 mb-6">
              {['ui', 'ai', 'ux'].map(cat => {
                const ideas = scenario.ideas.filter(i => clustered[i.id] === cat);
                return (
                  <div key={cat} className={`p-4 rounded-xl border ${categoryColors[cat]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold">{categoryLabels[cat]}</span>
                      <span className="text-xs opacity-70">{ideas.length} ideas</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ideas.map(i => (
                        <span key={i.id} className="text-xs bg-black/20 px-2 py-1 rounded">
                          {i.text}
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={`Name this cluster...`}
                      value={clusterNames[cat] || ''}
                      onChange={(e) => setClusterNames({ ...clusterNames, [cat]: e.target.value })}
                      className="w-full bg-black/30 border border-current rounded-lg px-3 py-2 text-sm text-white placeholder-white/50"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('converge')}
              disabled={Object.keys(clusterNames).length < 3}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              Continue to Convergence →
            </button>
          </>
        )}

        {phase === 'converge' && (
          <>
            <p className="text-gray-400 text-center mb-6">
              Select the top 3 ideas that should be prioritized. Choose wisely!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {scenario.ideas.map(idea => {
                const isSelected = selected.includes(idea.id);
                return (
                  <button
                    key={idea.id}
                    onClick={() => handleConverge(idea.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                      ${isSelected 
                        ? 'bg-teal-900/30 border-teal-500' 
                        : 'bg-gray-800 border-gray-700 hover:border-teal-500/50'
                      }`}
                  >
                    <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[clustered[idea.id]]}`}>
                      {categoryLabels[clustered[idea.id]]}
                    </span>
                    <p className="text-white text-sm mt-2">{idea.text}</p>
                    {isSelected && (
                      <span className="text-teal-400 text-xs">★ Selected #{selected.indexOf(idea.id) + 1}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">
                Selected: {selected.length}/3
              </span>
            </div>

            <button
              onClick={() => setPhase('complete')}
              disabled={selected.length !== 3}
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              Finalize Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
}
