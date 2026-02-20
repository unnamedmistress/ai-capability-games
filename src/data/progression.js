export const LEVELS = [
  { id: 'novice', name: 'Novice', icon: '🌱', minXp: 0, color: '#6b7280' },
  { id: 'apprentice', name: 'Apprentice', icon: '🌿', minXp: 500, color: '#22c55e' },
  { id: 'competent', name: 'Competent', icon: '⚔️', minXp: 1200, color: '#3b82f6' },
  { id: 'proficient', name: 'Proficient', icon: '🔮', minXp: 2200, color: '#8b5cf6' },
  { id: 'expert', name: 'Expert', icon: '👑', minXp: 3500, color: '#f59e0b' }
];

export const BADGES = [
  {
    id: 'first-win',
    name: 'First Steps',
    description: 'Complete any 1 lesson',
    icon: '🎯',
    condition: (progress) => progress.completed.length >= 1,
    xpBonus: 50
  },
  {
    id: 'foundation',
    name: 'Foundation Builder',
    description: 'Complete all Foundation lessons (1-5)',
    icon: '🧱',
    condition: (progress) => [1, 2, 3, 4, 5].every(id => progress.completed.includes(id)),
    xpBonus: 150
  },
  {
    id: 'synthesis-master',
    name: 'Synthesis Master',
    description: 'Complete all Synthesis lessons (6-12)',
    icon: '⚗️',
    condition: (progress) => [6, 7, 8, 9, 10, 11, 12].every(id => progress.completed.includes(id)),
    xpBonus: 200
  },
  {
    id: 'creator',
    name: 'Creative Catalyst',
    description: 'Complete all Creation lessons (13-16)',
    icon: '✨',
    condition: (progress) => [13, 14, 15, 16].every(id => progress.completed.includes(id)),
    xpBonus: 200
  },
  {
    id: 'strategist',
    name: 'Master Strategist',
    description: 'Complete all Strategy lessons (17-20)',
    icon: '🧠',
    condition: (progress) => [17, 18, 19, 20].every(id => progress.completed.includes(id)),
    xpBonus: 250
  },
  {
    id: 'workflow-warrior',
    name: 'Workflow Warrior',
    description: 'Complete lessons 11-19 (The Distillery through Relay Race)',
    icon: '🔄',
    condition: (progress) => [11, 12, 13, 14, 15, 16, 17, 18, 19].every(id => progress.completed.includes(id)),
    xpBonus: 300
  },
  {
    id: 'vault-master',
    name: 'Vault Master',
    description: 'Complete lesson 20 with 5 templates saved',
    icon: '🏦',
    condition: (progress) => progress.completed.includes(20) && (progress.savedTemplates?.length || 0) >= 5,
    xpBonus: 500
  },
  {
    id: 'perfect-ten',
    name: 'Perfectionist',
    description: 'Score 100% on any 10 games',
    icon: '💯',
    condition: (progress) => (progress.perfectScores?.length || 0) >= 10,
    xpBonus: 300
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 games with time bonuses',
    icon: '⚡',
    condition: (progress) => (progress.speedBonuses?.length || 0) >= 5,
    xpBonus: 200
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Achieve a 5-game winning streak',
    icon: '🔥',
    condition: (progress) => progress.bestStreak >= 5,
    xpBonus: 250
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all 20 lessons',
    icon: '🏆',
    condition: (progress) => progress.completed.length >= 20,
    xpBonus: 1000
  }
];

export const ACHIEVEMENTS = [
  { id: 'daily-login', name: 'Daily Scholar', description: 'Complete a lesson on 3 consecutive days', icon: '📅' },
  { id: 'retry-champion', name: 'Retry Champion', description: 'Complete a lesson after failing twice', icon: '💪' },
  { id: 'helpful-hint', name: 'Strategic Thinker', description: 'Use hints in 5 different lessons', icon: '💡' },
  { id: 'layer-complete', name: 'Layer Master', description: 'Complete all lessons in one layer', icon: '🥞' }
];

export const getLevelByXp = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
};

export const getNextLevel = (currentXp) => {
  const currentLevel = getLevelByXp(currentXp);
  const currentIndex = LEVELS.findIndex(l => l.id === currentLevel.id);
  return LEVELS[currentIndex + 1] || null;
};

export const getXpToNextLevel = (currentXp) => {
  const nextLevel = getNextLevel(currentXp);
  if (!nextLevel) return 0;
  return nextLevel.minXp - currentXp;
};

export const getProgressToNextLevel = (currentXp) => {
  const currentLevel = getLevelByXp(currentXp);
  const nextLevel = getNextLevel(currentXp);
  if (!nextLevel) return 100;
  
  const range = nextLevel.minXp - currentLevel.minXp;
  const progress = currentXp - currentLevel.minXp;
  return Math.min(100, Math.round((progress / range) * 100));
};

export const checkNewBadges = (progress, previousProgress = null) => {
  const newBadges = [];
  BADGES.forEach(badge => {
    const hasBadge = progress.badges?.includes(badge.id);
    const qualifies = badge.condition(progress);
    const hadBefore = previousProgress?.badges?.includes(badge.id);
    
    if (qualifies && !hasBadge) {
      newBadges.push(badge);
    }
  });
  return newBadges;
};

export const getTotalPossibleXp = () => {
  // Sum of all lesson XP + badge bonuses
  const lessonXp = 20 * 200; // Approximate max
  const badgeXp = BADGES.reduce((sum, b) => sum + (b.xpBonus || 0), 0);
  return lessonXp + badgeXp;
};
