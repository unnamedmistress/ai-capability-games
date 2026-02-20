import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonBySlug, LESSONS } from '../data/lessons';
import * as Games from './games';

const gameComponents = {
  'partnership-calibrator': Games.PartnershipCalibrator,
  'goal-forge': Games.GoalForge,
  'spec-lab': Games.SPECLab,
  'the-chunker': Games.TheChunker,
  'workflow-sorter': Games.WorkflowSorter,
  'the-interrogator': Games.TheInterrogator,
  'speed-draft-arena': Games.SpeedDraftArena,
  'the-crucible': Games.TheCrucible,
  'the-refinery': Games.TheRefinery,
  'claim-detector': Games.ClaimDetector,
  'the-distillery': Games.TheDistillery,
  'the-reconciler': Games.TheReconciler,
  'idea-funnel': Games.IdeaFunnel,
  'the-shapeshifter': Games.TheShapeshifter,
  'red-pen-room': Games.RedPenRoom,
  'decision-arena': Games.DecisionArena,
  'the-decomposer': Games.TheDecomposer,
  'skeptics-gauntlet': Games.SkepticsGauntlet,
  'relay-race': Games.RelayRace,
  'the-vault': Games.TheVault
};

export default function LessonRouter({ onComplete }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lesson = getLessonBySlug(slug);
  
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <p className="text-gray-400 mb-6">The lesson "{slug}" doesn't exist.</p>
          <button 
            onClick={() => navigate('/lessons')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const GameComponent = gameComponents[slug];
  
  if (!GameComponent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Game Coming Soon</h1>
          <p className="text-gray-400 mb-6">"{lesson.title}" is not implemented yet.</p>
          <button 
            onClick={() => navigate('/lessons')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  // Find next lesson for navigation
  const currentIndex = LESSONS.findIndex(l => l.slug === slug);
  const nextLesson = LESSONS[currentIndex + 1];

  const handleComplete = (xpEarned) => {
    // Call the parent's onComplete to update progress
    if (onComplete) {
      onComplete(xpEarned);
    }
    
    // Navigate to next lesson or back to lessons page
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.slug}`);
    } else {
      navigate('/lessons');
    }
  };

  return <GameComponent lessonId={lesson.id} onComplete={handleComplete} />;
}
