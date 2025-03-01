import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";
import QuizResults from "@/components/QuizResults";
import UserInfoForm from "@/components/UserInfoForm";
import { QuestionResponse } from "@/types/quiz";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";
import { saveQuizResults } from "@/lib/firestore";

type Step = "introduction" | "questions" | "signup" | "results" | "user-info";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate temp_id when quiz starts
    if (!localStorage.getItem('temp_id')) {
      localStorage.setItem('temp_id', crypto.randomUUID());
    }
  }, []);

  const handleQuizComplete = async (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[],
    round1TopThree: string[],
    round2TopTwo: string[]
  ) => {
    try {
      const temp_id = localStorage.getItem('temp_id') || crypto.randomUUID();
      localStorage.setItem('temp_id', temp_id);
      
      const sortedTypes = Object.entries(newScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([type]) => type);

      const resultsToStore = {
        temp_id,
        scores: newScores,
        responses: quizResponses,
        round1_top_three: round1TopThree,
        round2_top_two: round2TopTwo,
        dominant_type: sortedTypes[0]?.replace('type', '') || '',
        second_type: sortedTypes[1]?.replace('type', '') || '',
        third_type: sortedTypes[2]?.replace('type', '') || '',
        userId: user?.uid || null,
        userName: user?.displayName || null,
        userEmail: user?.email || null,
        createdAt: Date.now()
      };

      await saveQuizResults(resultsToStore);
      
      if (user) {
        setStep('results');
      } else {
        navigate('/signup');
      }
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
    if (!scores || !responses) return;
    
    try {
        await handleQuizComplete(scores, responses, [], []);
        setStep('results');
    } catch (error) {
        console.error('Error saving quiz results:', error);
        toast({
            title: "Error",
            description: "Failed to save your results",
            variant: "destructive"
        });
    }
  };

  const renderStep = () => {
    switch (step) {
      case "introduction":
        return <TestIntroduction onStart={() => setStep("questions")} onBack={() => navigate("/")} />;
      case "questions":
        return <Questions onComplete={handleQuizComplete} onBack={() => setStep("introduction")} />;
      case "signup":
        return (
          <div className="max-w-md mx-auto">
            <SignUpForm 
              onSuccess={() => setStep('results')} 
              quizScores={scores}
            />
          </div>
        );
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
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      <div className="relative z-10">
        {renderStep()}
      </div>
    </div>
  );
};

export default Quiz;