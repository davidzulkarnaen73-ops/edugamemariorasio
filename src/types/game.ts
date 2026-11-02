/**
 * Type definitions for COIN QUEST 3D - Universal Educational Platformer Game
 */

export interface Question {
  id: string;
  level: 1 | 2 | 3;
  questionNumber: number; // 1 to 15
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  hint: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  subtopic: string;
}

export interface QuestionAttemptState {
  solved: boolean;
  firstAttemptCorrect: boolean;
  attempts: number;
  lastChosenOption?: number;
}

export interface PlayerStats {
  score: number;
  coinsCount: number;
  questionsAnswered: number;
  firstTryCorrectCount: number;
  retriedQuestionsCount: number;
}

export type ScreenType = 'menu' | 'instructions' | 'level_select' | 'playing' | 'results';

export interface LevelInfo {
  id: 1 | 2 | 3;
  name: string;
  title: string;
  description: string;
  themeColor: string;
  bgSkyColor: number;
  unlocked: boolean;
}
