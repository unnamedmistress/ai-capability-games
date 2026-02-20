import { useState, useEffect } from 'react';

const useProgress = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [badges, setBadges] = useState([]);

  // Load progress from localStorage on initial render
  useEffect(() => {
    const savedProgress = localStorage.getItem('aiSkillsProgress');
    if (savedProgress) {
      const { xp: savedXp, level: savedLevel, completed: savedCompleted, badges: savedBadges } = JSON.parse(savedProgress);
      setXp(savedXp);
      setLevel(savedLevel);
      setCompleted(savedCompleted);
      setBadges(savedBadges);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'aiSkillsProgress',
      JSON.stringify({ xp, level, completed, badges })
    );
  }, [xp, level, completed, badges]);

  const completeLesson = (lessonId, xpEarned) => {
    setXp((prevXp) => prevXp + xpEarned);
    setCompleted((prevCompleted) => [...prevCompleted, lessonId]);
    
    // Check for level up (every 500 XP)
    if (xp + xpEarned >= level * 500) {
      setLevel((prevLevel) => prevLevel + 1);
    }

    // Check for badges (e.g., complete 5 lessons)
    if (completed.length + 1 >= 5 && !badges.includes('fastLearner')) {
      setBadges((prevBadges) => [...prevBadges, 'fastLearner']);
    }
  };

  const resetProgress = () => {
    setXp(0);
    setLevel(1);
    setCompleted([]);
    setBadges([]);
    localStorage.removeItem('aiSkillsProgress');
  };

  return { xp, level, completed, badges, completeLesson, resetProgress };
};

export { useProgress };