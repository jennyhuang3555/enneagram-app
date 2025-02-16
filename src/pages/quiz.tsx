import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";
import QuizResults from "@/components/QuizResults";
import UserInfoForm from "@/components/UserInfoForm";
import { supabase } from "@/lib/supabase";
import { QuestionResponse } from "@/types/quiz";

type Step = "landing" | "introduction" | "questions" | "user-info" | "results";

// Sample quiz data - in a real app, this would come from your backend
const sampleQuiz = {
  id: "1",
  title: "Enneagram Test",
  description: "Discover your Enneagram type",
  questions: [],
  resultRanges: [
    {
      id: "1",
      category: "type1",
      minScore: 0,
      maxScore: 25,
      title: "Type 1: The Reformer",
      description: "Principled, purposeful, self-controlled, and perfectionistic"
    },
    {
      id: "2",
      category: "type2",
      minScore: 0,
      maxScore: 25,
      title: "Type 2: The Helper",
      description: "Generous, demonstrative, people-pleasing, and possessive"
    },
    // Add more types as needed
  ]
};

// Add this interface
interface UserResult {
  name: string;
  email: string;
  scores: { [key: string]: number };
  timestamp: string;
}

const Quiz = () => {
  const [step, setStep] = useState<Step>("introduction");
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [dominantType, setDominantType] = useState<string>('');
  const [secondType, setSecondType] = useState<string>('');
  const [thirdType, setThirdType] = useState<string>('');

  const handleQuizComplete = (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[]
  ) => {
    setScores(newScores);
    setResponses(quizResponses);
    
    // Sort by score values (highest to lowest)
    const sortedTypes = Object.entries(newScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([type]) => type);

    console.log('Sorted scores:', Object.entries(newScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([type, score]) => `${type}: ${score}`));
    
    setDominantType(sortedTypes[0]);
    setSecondType(sortedTypes[1]);
    setThirdType(sortedTypes[2]);
    
    setStep("user-info");
  };

  const handleUserInfoSubmit = async (userInfo: { name: string; email: string }) => {
    console.log('Types before submission:', {
      dominant: dominantType,
      second: secondType,
      third: thirdType
    });

    const payload = {
      name: userInfo.name,
      email: userInfo.email,
      scores: scores || {},
      responses: responses,
      dominant_type: dominantType?.replace('type', '') || '',  // Will now correctly be just the number
      second_type: secondType?.replace('type', '') || '',      // Will now correctly be just the number
      third_type: thirdType?.replace('type', '') || '',        // Will now correctly be just the number
      created_at: new Date().toISOString()
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase Error:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Successfully saved results:', data);
      setStep('results');
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#E5DEFF] via-[#FDE1D3] to-[#D3E4FD]/20">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 88,35 67,52 76,77 50,63 24,77 33,52 12,35 39,35" fill="currentColor"/></svg>')`,
            backgroundSize: '400px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <div className="relative z-10">
        {step === "introduction" && (
          <TestIntroduction 
            onStart={() => setStep("questions")} 
            onBack={() => setStep("introduction")} 
          />
        )}
        {step === "questions" && (
          <Questions
            onComplete={handleQuizComplete}
            onBack={() => setStep("introduction")}
          />
        )}
        {step === "user-info" && (
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        )}
        {step === "results" && scores && (
          <QuizResults
            quiz={sampleQuiz}
            scores={scores}
            responses={responses}
            onClose={() => setStep("introduction")}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;