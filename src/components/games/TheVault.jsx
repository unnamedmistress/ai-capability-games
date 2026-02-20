import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const templates = [
  {
    id: 1,
    name: 'Email Draft',
    description: 'Professional email generator',
    placeholders: ['recipient', 'purpose', 'tone'],
    template: 'Write a {tone} email to {recipient} regarding {purpose}.',
    example: 'Write a formal email to the client regarding project delays.'
  },
  {
    id: 2,
    name: 'Code Review',
    description: 'Code review request',
    placeholders: ['language', 'focus_area', 'urgency'],
    template: 'Review this {language} code with focus on {focus_area}. Priority: {urgency}.',
    example: 'Review this Python code with focus on security. Priority: high.'
  },
  {
    id: 3,
    name: 'Meeting Agenda',
    description: 'Generate meeting agenda',
    placeholders: ['meeting_type', 'duration', 'attendees'],
    template: 'Create a {duration} agenda for {meeting_type} with {attendees}.',
    example: 'Create a 30-minute agenda for standup with engineering team.'
  },
  {
    id: 4,
    name: 'Summary',
    description: 'Document summarizer',
    placeholders: ['document_type', 'length', 'audience'],
    template: 'Summarize this {document_type} in {length} for {audience}.',
    example: 'Summarize this report in 3 bullets for executives.'
  },
  {
    id: 5,
    name: 'Analysis',
    description: 'Data analysis request',
    placeholders: ['data_type', 'metric', 'timeframe'],
    template: 'Analyze {data_type} focusing on {metric} over {timeframe}.',
    example: 'Analyze sales focusing on conversion over last quarter.'
  }
];

const lesson = LESSONS.find(l => l.slug === 'the-vault');

export default function TheVault({ lessonId, onComplete }) {
  const [completed, setCompleted] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [values, setValues] = useState({});
  const [showTest, setShowTest] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleFill = (template) => {
    setActiveTemplate(template);
    setValues({});
    setShowTest(false);
  };

  const handleValueChange = (placeholder, value) => {
    setValues({ ...values, [placeholder]: value });
  };

  const generatePrompt = () => {
    let prompt = activeTemplate.template;
    activeTemplate.placeholders.forEach(p => {
      prompt = prompt.replace(`{${p}}`, values[p] || `[${p}]`);
    });
    return prompt;
  };

  const handleTest = () => {
    setShowTest(true);
  };

  const handleSave = () => {
    if (!completed.includes(activeTemplate.id)) {
      setCompleted([...completed, activeTemplate.id]);
    }
    setActiveTemplate(null);
    
    if (completed.length + 1 >= templates.length) {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    const xp = completed.length >= 5 ? lesson.xp : Math.round(lesson.xp * (completed.length / 5));
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={completed.length >= 5}
        onNext={() => onComplete(xp)}
        onReplay={() => window.location.reload()}
      />
    );
  }

  if (activeTemplate) {
    const allFilled = activeTemplate.placeholders.every(p => values[p] && values[p].trim());
    
    return (
      <div className="min-h-screen bg-gray-900">
        <GameHeader lesson={lesson} onBack={() => setActiveTemplate(null)} />
        
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <span className="text-fuchsia-400 text-sm font-bold">TEMPLATE</span>
            <h2 className="text-2xl font-bold text-white">{activeTemplate.name}</h2>
            <p className="text-gray-400">{activeTemplate.description}</p>
          </div>

          {/* Placeholders */}
          <div className="space-y-4 mb-6">
            {activeTemplate.placeholders.map(p => (
              <div key={p} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <label className="text-sm text-gray-400 block mb-2 capitalize">
                  {p.replace('_', ' ')}:
                </label>
                <input
                  type="text"
                  value={values[p] || ''}
                  onChange={(e) => handleValueChange(p, e.target.value)}
                  placeholder={`Enter ${p}...`}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          {showTest && (
            <div className="bg-fuchsia-900/20 rounded-xl p-4 mb-6 border border-fuchsia-500/30">
              <p className="text-sm text-fuchsia-400 mb-2">Generated Prompt:</p>
              <p className="text-white font-mono">{generatePrompt()}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleTest}
              disabled={!allFilled}
              className="flex-1 py-3 bg-gray-700 rounded-xl font-bold text-white disabled:opacity-50"
            >
              Test Template
            </button>
            <button
              onClick={handleSave}
              disabled={!allFilled}
              className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50"
            >
              Save to Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <GameHeader lesson={lesson} onBack={() => window.history.back()} />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🏦</span>
          <h2 className="text-2xl font-bold text-white mt-2">The Vault</h2>
          <p className="text-gray-400">Create reusable prompt templates</p>
          <p className="text-fuchsia-400 text-sm mt-2">
            Completed: {completed.length}/{templates.length}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {templates.map(t => {
            const isDone = completed.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => handleFill(t)}
                className={`p-6 rounded-xl border-2 text-left transition-all
                  ${isDone 
                    ? 'bg-green-900/20 border-green-500' 
                    : 'bg-gray-800 border-gray-700 hover:border-fuchsia-500/50'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{t.name}</span>
                  {isDone && <span className="text-green-400">✓</span>}
                </div>
                <p className="text-gray-400 text-sm mb-3">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.placeholders.map(p => (
                    <span key={p} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {'{'}{p}{'}'}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
