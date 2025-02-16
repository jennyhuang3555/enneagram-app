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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";

type Step = "introduction" | "questions" | "signup" | "results";

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
  const { user } = useAuth();
  const navigate = useNavigate();

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
    
    // If user is already logged in, save results directly
    if (user) {
      handleSaveResults();
    } else {
      setStep("signup");
    }
  };

  const handleSaveResults = async () => {
    if (!scores || !user) return;

    try {
      const payload = {
        user_id: user.id,
        scores: scores,
        responses: responses,
        dominant_type: dominantType?.replace('type', '') || '',
        second_type: secondType?.replace('type', '') || '',
        third_type: thirdType?.replace('type', '') || '',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('quiz_results')
        .insert([payload]);

      if (error) throw error;

      setStep('results');
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "Failed to save your results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignUpSuccess = async () => {
    await handleSaveResults();
  };

  const renderStep = () => {
    switch (step) {
      case "introduction":
        return <TestIntroduction onStart={() => setStep("questions")} onBack={() => navigate("/")} />;
      case "questions":
        return <Questions onComplete={handleQuizComplete} onBack={() => setStep("introduction")} />;
      case "signup":
        return <SignUpForm onSuccess={handleSignUpSuccess} />;
      case "results":
        return scores ? (
          <QuizResults 
            quiz={sampleQuiz} 
            scores={scores} 
            responses={responses}
            onClose={() => navigate("/")} 
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {renderStep()}
    </div>
  );
};

export default Quiz;