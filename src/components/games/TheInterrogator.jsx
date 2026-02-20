import React, { useState } from 'react';
import GameHeader from '../shared/GameHeader';
import CompletionScreen from '../shared/CompletionScreen';
import { LESSONS } from '../../data/lessons';

const scenarios = [
  {
    id: 1,
    title: 'Product Launch',
    description: 'Planning a new product launch for Q3',
    rankedQuestions: ['q1', 'q2', 'q6', 'q3', 'q5', 'q8', 'q4', 'q7', 'q9', 'q10', 'q11', 'q12']
  },
  {
    id: 2,
    title: 'Security Breach',
    description: 'Responding to a potential data security incident',
    rankedQuestions: ['q4', 'q6', 'q2', 'q8', 'q1', 'q3', 'q5', 'q7', 'q9', 'q10', 'q11', 'q12']
  },
  {
    id: 3,
    title: 'Team Conflict',
    description: 'Resolving interpersonal conflicts within the engineering team',
    rankedQuestions: ['q2', 'q8', 'q1', 'q11', 'q6', 'q3', 'q4', 'q5', 'q7', 'q9', 'q10', 'q12']
  }
];

const questions = [
  { id: 'q1', text: 'What are the key objectives?', type: 'objectives' },
  { id: 'q2', text: 'Who are the stakeholders?', type: 'stakeholders' },
  { id: 'q3', text: 'What resources are required?', type: 'resources' },
  { id: 'q4', text: 'What are the potential risks?', type: 'risks' },
  { id: 'q5', text: 'What metrics will measure success?', type: 'metrics' },
  { id: 'q6', text: 'What is the timeline?', type: 'timeline' },
  { id: 'q7', text: 'What are the dependencies?', type: 'dependencies' },
  { id: 'q8', text: 'What communication plan is needed?', type: 'communication' },
  { id: 'q9', text: 'What budget is allocated?', type: 'budget' },
  { id: 'q10', text: 'What alternatives were considered?', type: 'alternatives' },
  { id: 'q11', text: 'What assumptions are being made?', type: 'assumptions' },
  { id: 'q12', text: 'What lessons from past launches apply?', type: 'lessons' }
];

const lesson = LESSONS.find(l => l.slug === 'the-interrogator');

export default function TheInterrogator({ lessonId, onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const scenario = scenarios[currentScenario];
  const remainingQuestions = questions.filter(q => !selectedQuestions.includes(q.id));

  const toggleQuestion = (qid) => {
    if (showFeedback) return;
    
    if (selectedQuestions.includes(qid)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== qid));
    } else if (selectedQuestions.length < 6) {
      setSelectedQuestions([...selectedQuestions, qid]);
    }
  };

  const calculateScore = () => {
    let score = 0;
    const ranked = scenario.rankedQuestions;
    
    selectedQuestions.forEach((qid, index) => {
      const rank = ranked.indexOf(qid);
      // Top 6 questions in order get highest scores
      if (rank < 6) {
        score += 20; // In top 6
        if (rank === index) score += 5; // Correct position bonus
      } else if (rank < 9) {
        score += 10; // In top 9
      } else {
        score += 5; // Lower priority
      }
    });
    
    return Math.min(100, score);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setScores([...scores, score]);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setSelectedQuestions([]);
        setShowFeedback(false);
      } else {
        setIsComplete(true);
      }
    }, 2500);
  };

  if (isComplete) {
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const xp = avgScore >= 75 ? lesson.xp : Math.round(lesson.xp * (avgScore / 100));
    
    return (
      <CompletionScreen
        lesson={lesson}
        xpEarned={xp}
        perfect={avgScore >= 90}
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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
            <span>Score: {scores.length > 0 ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0}/100</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-full bg-purple-500 rounded-full transition-all" 
                 style={{ width: `${((currentScenario) / scenarios.length) * 100}%` }} />
          </div>
        </div>

        {/* Scenario */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2">{scenario.title}</h2>
          <p className="text-gray-400">{scenario.description}</p>
        </div>

        {/* Selected Questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">
            Key Questions ({selectedQuestions.length}/6)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 min-h-[120px] p-4 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700">
            {selectedQuestions.map((qid, idx) => {
              const q = questions.find(q => q.id === qid);
              return (
                <button
                  key={qid}
                  onClick={() => toggleQuestion(qid)}
                  className="p-3 bg-purple-900/30 border border-purple-500 rounded-lg text-left text-sm text-white hover:bg-purple-900/50 transition-colors"
                >
                  <span className="text-purple-400 font-bold mr-2">{idx + 1}.</span>
                  {q.text}
                </button>
              );
            })}
            {Array(6 - selectedQuestions.length).fill(0).map((_, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-gray-600 text-sm flex items-center justify-center">
                Slot {selectedQuestions.length + i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Available Questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Available Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {remainingQuestions.map(q => (
              <button
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                disabled={selectedQuestions.length >= 6}
                className="p-3 text-left bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="text-gray-300 text-sm">{q.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedQuestions.length < 6 || showFeedback}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showFeedback ? 'Processing...' : 'Simulate Interview'}
        </button>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl border ${calculateScore() >= 75 ? 'bg-green-900/30 border-green-500' : 'bg-yellow-900/30 border-yellow-500'}`}>
            <p className={`font-bold mb-2 ${calculateScore() >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
              Quality Score: {calculateScore()}/100
            </p>
            <p className="text-gray-300 text-sm">
              {calculateScore() >= 75 
                ? 'Great questions! These will yield high-quality information.' 
                : 'Consider the priority of your questions. Some key areas may be missing.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
