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
  questionNumber: number;
  round: 1 | 2 | 3;
  questionText: string;
  selections: {
    optionId: string;
    optionText: string;
    type: string;  // Add type to track which enneagram type this option was for
    points: number;
  }[];
  timestamp?: number;  // Optional Firebase timestamp
}

// Also add this interface for the complete quiz result
export interface QuizResult {
  temp_id: string;
  scores: { [key: string]: number };
  responses: QuestionResponse[];
  round1_top_three: string[];
  round2_top_two: string[];
  dominant_type: string;
  second_type: string;
  third_type: string;
  head_type: string;
  heart_type: string;
  body_type: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  createdAt?: number;  // Firebase timestamp
}