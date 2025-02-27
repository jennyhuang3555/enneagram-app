export interface Question {
  id: string;
  text: string;
  category: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
}

export interface ResultRange {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  category: string; // Added to associate ranges with specific types
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  resultRanges: ResultRange[];
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  category: number;
  score: number;
  answerText: string;
}

export interface QuizOption {
  id: string;
  text: string;
  type: number;
}

export interface TriadQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizData {
  triadRound1: TriadQuestion[];
  triadRound2: TriadQuestion[];
  tieBreakers: TriadQuestion[];
}

export interface QuizResponse {
  questionId: string;
  selectedOrder: number[];
  round: 1 | 2 | 3;
}

export interface QuizResult {
  userId: string | null;
  responses: QuizResponse[];
  scores: {
    round1: { [key: string]: number };
    round2: { [key: string]: number };
    round3: { [key: string]: number };
  };
  topTypes: {
    round1: number[];
    round2: number[];
    final: number[];
  };
  dominantType: number;
  secondType: number;
  thirdType: number;
}