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
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import SignUpForm from "@/components/SignUpForm";

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

  const handleQuizComplete = async (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[]
  ) => {
    try {
      const session_id = crypto.randomUUID();
      
      const sortedTypes = Object.entries(newScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([type]) => type);

      const resultsToStore = {
        session_id,
        scores: newScores,
        responses: quizResponses,
        dominant_type: sortedTypes[0]?.replace('type', '') || '',
        second_type: sortedTypes[1]?.replace('type', '') || '',
        third_type: sortedTypes[2]?.replace('type', '') || '',
        created_at: new Date().toISOString(),
        ...(user ? { 
          user_id: user.id,
          name: user.user_metadata?.name,
          email: user.email 
        } : {})
      };

      const { data, error } = await supabase
        .from('quiz_profile')
        .insert([resultsToStore])
        .select()
        .single();

      if (error) throw error;

      // Store session_id for later linking
      sessionStorage.setItem('quiz_session_id', session_id);
      
      setStep(user ? 'results' : 'signup');
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "Failed to save your results. Please try again.",
        variant: "destructive"
      });
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
        .from('quiz_profile')
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
    if (!scores || !responses) return;
    
    try {
        await handleSaveResults();
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {renderStep()}
    </div>
  );
};

export default Quiz;