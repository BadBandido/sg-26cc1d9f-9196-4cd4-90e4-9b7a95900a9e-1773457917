export interface User {
  id: string;
  email: string;
  country: string;
  countryCode: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "moderate" | "hard";
  points: number;
  penalty: number;
}

export interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

export interface GameSession {
  id: string;
  userId: string;
  setId: string;
  score: number;
  completedAt: string;
  timeElapsed: number;
  answers: {
    questionId: string;
    selectedAnswer: number | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  email: string;
  country: string;
  countryCode: string;
  score: number;
  setId: string;
  completedAt: string;
  timeElapsed: number;
}

export interface GlobalLeaderboardEntry {
  userId: string;
  email: string;
  country: string;
  countryCode: string;
  totalScore: number;
  gamesPlayed: number;
  highestScore: number;
  fastestTime: number;
}

export type ThemeColor = 
  | "navy-blue" 
  | "army-green" 
  | "burgundy" 
  | "amaranth" 
  | "purple" 
  | "teal" 
  | "brown";

export type FontSize = "small" | "normal" | "large";

export interface UserSettings {
  userId: string;
  theme: ThemeColor;
  fontSize: FontSize;
}

export interface AdminCredentials {
  username: string;
  password: string;
}