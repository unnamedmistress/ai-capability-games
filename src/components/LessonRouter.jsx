import React from 'react';
import { useParams } from 'react-router-dom';
import { getLessonBySlug } from '../data/lessons';
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
  const lesson = getLessonBySlug(slug);
  
  if (!lesson) {
    return <div className="p-8 text-white">Lesson not found</div>;
  }

  const GameComponent = gameComponents[slug];
  
  if (!GameComponent) {
    return <div className="p-8 text-white">Game not implemented yet for: {slug}</div>;
  }

  return <GameComponent onComplete={onComplete} />;
}
