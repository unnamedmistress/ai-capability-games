import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aiCapabilityGames_progress';

const useProgress = () => {
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    completed: [],
    badges: []
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({
          xp: parsed.xp || 0,
          level: parsed.level || 1,
          completed: parsed.completed || [],
          badges: parsed.badges || []
        });
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }
  }, [progress, isLoaded]);

  const completeLesson = useCallback((xpEarned) => {
    setProgress(prev => {
      const newXp = prev.xp + xpEarned;
      const newLevel = Math.floor(newXp / 500) + 1;
      const newCompleted = [...prev.completed, Date.now()]; // Use timestamp as unique ID
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completed: newCompleted
      };
    });
  }, []);

  const hasCompleted = useCallback((lessonId) => {
    return progress.completed.includes(lessonId);
  }, [progress.completed]);

  const resetProgress = useCallback(() => {
    setProgress({
      xp: 0,
      level: 1,
      completed: [],
      badges: []
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Derived values
  const completedCount = progress.completed.length;
  const progressPercent = Math.min((completedCount / 20) * 100, 100);
  const xpToNextLevel = (progress.level * 500) - progress.xp;

  return {
    progress: progress.xp,
    level: progress.level,
    completed: progress.completed,
    completedCount,
    progressPercent,
    badges: progress.badges,
    xpToNextLevel,
    isLoaded,
    completeLesson,
    hasCompleted,
    resetProgress
  };
};

export { useProgress };
