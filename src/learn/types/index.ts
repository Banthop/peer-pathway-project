export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string; // e.g. "8 min"
  xp: number;
  content: LessonSection[];
  challengeId?: string;
}

export type LessonSectionType =
  | 'heading'
  | 'text'
  | 'analogy'
  | 'keypoint'
  | 'formula'
  | 'warning'
  | 'example'
  | 'divider';

export interface LessonSection {
  type: LessonSectionType;
  text: string;
  label?: string; // e.g. analogy label "ANALOGY: The Casino"
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  xpPool: number;
  lessons: Lesson[];
  unlockCondition?: string; // human-readable
  color: string; // hex
  accentColor: string;
}

export type ChallengeType =
  | 'ev-calculator'
  | 'kelly-criterion'
  | 'risk-ruin'
  | 'bias-detector'
  | 'probability-game'
  | 'order-book'
  | 'funding-arb';

export interface ChallengeConfig {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  xpReward: number;
  xpPerfect: number;
}

export interface ProgressStore {
  version: number;
  totalXP: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedChallenges: Record<string, number>; // id → score 0-100
  unlockedModules: number[];
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
}
