import type { Level, Badge } from '../types';

export const LEVELS: Level[] = [
  { level: 1, name: 'Cadet', xpRequired: 0 },
  { level: 2, name: 'Analyst', xpRequired: 200 },
  { level: 3, name: 'Trader', xpRequired: 450 },
  { level: 4, name: 'Strategist', xpRequired: 750 },
  { level: 5, name: 'Risk Manager', xpRequired: 1100 },
  { level: 6, name: 'Quant', xpRequired: 1500 },
  { level: 7, name: 'Edge Hunter', xpRequired: 2000 },
  { level: 8, name: 'Fund Manager', xpRequired: 2600 },
  { level: 9, name: 'Quant God', xpRequired: 3100 },
];

export const BADGES: Badge[] = [
  { id: 'first-blood', name: 'First Blood', description: 'Completed your first lesson', icon: '🩸' },
  { id: 'ev-positive', name: 'EV Positive', description: 'Passed the Expected Value challenge', icon: '📊' },
  { id: 'kelly-safe', name: 'Kelly Safe', description: 'Stayed within 10% of Kelly-optimal across all bets', icon: '🎯' },
  { id: 'zero-ruin', name: 'Zero Ruin', description: 'Survived all risk scenarios without hitting ruin', icon: '🛡️' },
  { id: 'bias-free', name: 'Bias Free', description: 'Scored 80%+ on the Bias Detector', icon: '🧠' },
  { id: 'streak-3', name: '3-Day Streak', description: '3 days in a row', icon: '🔥' },
  { id: 'calibrated', name: 'Well Calibrated', description: 'Excellent Brier score on Calibration Trainer', icon: '⚖️' },
  { id: 'module-1', name: 'Edge Found', description: 'Completed Module 1', icon: '✅' },
  { id: 'module-master', name: 'Module Master', description: 'Completed all 6 modules', icon: '👑' },
  { id: 'quant-god', name: 'Quant God', description: 'Reached Level 9', icon: '🧬' },
];

export function getLevelFromXP(xp: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) current = level;
    else break;
  }
  return current;
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelFromXP(xp);
  return LEVELS.find(l => l.level === current.level + 1) ?? null;
}

export function getXPProgress(xp: number): { current: number; next: number; pct: number } {
  const current = getLevelFromXP(xp);
  const next = getNextLevel(xp);
  if (!next) return { current: xp, next: xp, pct: 100 };
  const base = xp - current.xpRequired;
  const range = next.xpRequired - current.xpRequired;
  return { current: base, next: range, pct: Math.round((base / range) * 100) };
}
