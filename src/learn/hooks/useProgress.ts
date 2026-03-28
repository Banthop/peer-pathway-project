import { useState, useCallback, useEffect } from 'react';
import type { ProgressStore } from '../types';
import { getLevelFromXP } from '../data/levels';
import { MODULES } from '../data/modules';

const KEY = 'cryptoedge_progress';

const DEFAULT_PROGRESS: ProgressStore = {
  version: 1,
  totalXP: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  completedLessons: [],
  completedChallenges: {},
  unlockedModules: [1],
  badges: [],
};

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as ProgressStore;
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function save(data: ProgressStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

function computeUnlockedModules(progress: ProgressStore): number[] {
  const unlocked = new Set<number>([1]);

  // Module 2 unlocks when all Module 1 lessons are complete
  const m1Lessons = MODULES[0].lessons.map(l => l.id);
  if (m1Lessons.every(id => progress.completedLessons.includes(id))) {
    unlocked.add(2);
  }

  // Module 3 unlocks when Module 2 is complete
  const m2Lessons = MODULES[1].lessons.map(l => l.id);
  if (m2Lessons.every(id => progress.completedLessons.includes(id))) {
    unlocked.add(3);
  }

  // Module 4 unlocks when Module 3 is complete
  const m3Lessons = MODULES[2].lessons.map(l => l.id);
  if (m3Lessons.every(id => progress.completedLessons.includes(id))) {
    unlocked.add(4);
  }

  // Module 5 unlocks when Module 4 is complete
  const m4Lessons = MODULES[3].lessons.map(l => l.id);
  if (m4Lessons.every(id => progress.completedLessons.includes(id))) {
    unlocked.add(5);
  }

  // Module 6 unlocks when Module 5 complete + 1800+ XP
  const m5Lessons = MODULES[4].lessons.map(l => l.id);
  if (m5Lessons.every(id => progress.completedLessons.includes(id)) && progress.totalXP >= 1800) {
    unlocked.add(6);
  }

  return Array.from(unlocked);
}

function checkAndUpdateStreak(progress: ProgressStore): ProgressStore {
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActiveDate === today) return progress;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;

  return { ...progress, streak: newStreak, lastActiveDate: today };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressStore>(() => {
    const p = load();
    return checkAndUpdateStreak(p);
  });

  useEffect(() => {
    save(progress);
  }, [progress]);

  const awardXP = useCallback((amount: number, newBadges?: string[]) => {
    setProgress(prev => {
      const totalXP = prev.totalXP + amount;
      const level = getLevelFromXP(totalXP).level;
      const badges = newBadges
        ? [...new Set([...prev.badges, ...newBadges])]
        : prev.badges;
      const updated = { ...prev, totalXP, level, badges };
      updated.unlockedModules = computeUnlockedModules(updated);
      return updated;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xp: number) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const completedLessons = [...prev.completedLessons, lessonId];
      const totalXP = prev.totalXP + xp;
      const level = getLevelFromXP(totalXP).level;
      const badges: string[] = [...prev.badges];
      if (!badges.includes('first-blood')) badges.push('first-blood');
      const updated = { ...prev, completedLessons, totalXP, level, badges };
      updated.unlockedModules = computeUnlockedModules(updated);
      return updated;
    });
  }, []);

  const completeChallenge = useCallback((challengeId: string, score: number, xp: number, newBadges?: string[]) => {
    setProgress(prev => {
      const alreadyDone = prev.completedChallenges[challengeId] !== undefined;
      const previousScore = prev.completedChallenges[challengeId] ?? 0;
      if (alreadyDone && score <= previousScore) return prev;

      const xpDelta = alreadyDone ? Math.floor(xp * 0.5) : xp;
      const totalXP = prev.totalXP + xpDelta;
      const level = getLevelFromXP(totalXP).level;
      const completedChallenges = { ...prev.completedChallenges, [challengeId]: score };
      const badges = newBadges
        ? [...new Set([...prev.badges, ...newBadges])]
        : prev.badges;
      const updated = { ...prev, totalXP, level, completedChallenges, badges };
      updated.unlockedModules = computeUnlockedModules(updated);
      return updated;
    });
  }, []);

  const isLessonComplete = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const isChallengeComplete = useCallback((challengeId: string) => {
    return progress.completedChallenges[challengeId] !== undefined;
  }, [progress.completedChallenges]);

  const isModuleUnlocked = useCallback((moduleId: number) => {
    return progress.unlockedModules.includes(moduleId);
  }, [progress.unlockedModules]);

  const getModuleProgress = useCallback((moduleId: number): number => {
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod) return 0;
    const total = mod.lessons.length;
    const done = mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    return Math.round((done / total) * 100);
  }, [progress.completedLessons]);

  return {
    progress,
    awardXP,
    completeLesson,
    completeChallenge,
    isLessonComplete,
    isChallengeComplete,
    isModuleUnlocked,
    getModuleProgress,
  };
}
