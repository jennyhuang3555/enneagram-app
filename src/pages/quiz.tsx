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
import TriadQuestion from '@/components/TriadQuestion';
import { QuizData, QuizResult, QuizResponse } from '@/types/quiz';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import quizData from '/data/quiz-questions.json';

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
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [topTypes, setTopTypes] = useState<number[]>([]);

  useEffect(() => {
    // Generate temp_id when quiz starts
    if (!localStorage.getItem('temp_id')) {
      localStorage.setItem('temp_id', crypto.randomUUID());
    }

    const loadQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/quiz-questions.json');
        if (!response.ok) {
          throw new Error('Failed to load quiz data');
        }
        const data = await response.json();
        setQuizData(data);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, []);

  const handleQuizComplete = async (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[]
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
        dominant_type: sortedTypes[0]?.replace('type', '') || '',
        second_type: sortedTypes[1]?.replace('type', '') || '',
        third_type: sortedTypes[2]?.replace('type', '') || '',
        userId: user?.uid || null,
        userName: user?.displayName || null,
        userEmail: user?.email || null
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
        await handleQuizComplete(scores, responses);
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

  const calculateScores = (round: 1 | 2 | 3) => {
    const roundResponses = responses.filter(r => r.round === round);
    const roundScores: { [key: string]: number } = {};

    roundResponses.forEach(response => {
      const question = getCurrentQuestions().find(q => q.id === response.questionId);
      if (!question) return;

      response.selectedOrder.forEach((optionIndex, orderIndex) => {
        const option = question.options[optionIndex];
        const points = round === 1 ? 3 - orderIndex : 
                      round === 2 ? 2 - orderIndex :
                      orderIndex === 0 ? 1 : 0; // Round 3: 1 point for first choice, 0 for second
        roundScores[option.type] = (roundScores[option.type] || 0) + points;
      });
    });

    return roundScores;
  };

  const getCurrentQuestions = () => {
    if (!quizData) return [];
    switch (currentRound) {
      case 1: return quizData.triadRound1;
      case 2: return quizData.triadRound2;
      case 3: return quizData.tieBreakers;
      default: return [];
    }
  };

  const handleAnswer = async (selectedOrder: number[]) => {
    const questions = getCurrentQuestions();
    const currentQuestionData = questions[currentQuestion];

    // Store response
    const response: QuizResponse = {
      questionId: currentQuestionData.id,
      selectedOrder,
      round: currentRound,
    };
    setResponses([...responses, response]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // End of round
      const roundScores = calculateScores(currentRound);
      setScores(prev => ({ ...prev, [`round${currentRound}`]: roundScores }));

      // Calculate top types for the round
      const sortedTypes = Object.entries(roundScores)
        .sort(([, a], [, b]) => b - a)
        .map(([type]) => parseInt(type));

      if (currentRound === 1) {
        finishRound1(roundScores);
      } else if (currentRound === 2) {
        const round2Scores = calculateRound2Scores(responses);
        setScores(prev => ({ ...prev, round2: round2Scores }));
        
        // Calculate top types for the round
        const round2TopTypes = Object.entries(round2Scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 2)
          .map(([type]) => parseInt(type));

        setTopTypes(round2TopTypes);
        setCurrentRound(3);
        setCurrentQuestion(0);
      } else {
        // Quiz complete
        const finalTypes = sortedTypes.slice(0, 3);
        setTopTypes(finalTypes);
        
        // Save results to Firebase
        const result: QuizResult = {
          userId: user?.uid || null,
          responses,
          scores,
          topTypes: {
            ...topTypes,
            final: finalTypes,
          },
          dominantType: finalTypes[0],
          secondType: finalTypes[1],
          thirdType: finalTypes[2],
        };

        try {
          await addDoc(collection(db, 'quiz_results'), result);
          navigate('/results', { state: { result } });
        } catch (error) {
          console.error('Error saving quiz results:', error);
        }
      }
    }
  };

  const finishRound1 = (scores: { [key: string]: number }) => {
    // Get top 3 scoring types
    const sortedTypes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => parseInt(type));
    
    setTopTypes(sortedTypes);
    setCurrentRound(2);
    
    // Load round 2 questions filtered for top 3 types
    loadRound2Questions(sortedTypes);
  };

  const calculateRound2Scores = (responses: QuizResponse[]) => {
    const scores: { [key: string]: number } = {};
    
    responses.forEach(response => {
      response.selectedOrder.forEach((optionIndex, orderIndex) => {
        const option = getCurrentQuestions()[response.questionIndex].options[optionIndex];
        // 2 points for first, 1 for second, 0 for last
        const points = 2 - orderIndex;
        scores[option.type] = (scores[option.type] || 0) + points;
      });
    });

    return scores;
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

  if (loading) {
    return <div>Loading quiz data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quizData) {
    return <div>No quiz data available. Please try again later.</div>;
  }

  const questions = getCurrentQuestions();
  const currentQuestionData = questions[currentQuestion];

  // Add new state for tracking total questions
  const getTotalQuestionsAllRounds = () => {
    if (!quizData) return 0;
    return quizData.triadRound1.length + quizData.triadRound2.length + quizData.tieBreakers.length;
  };

  const getQuestionsCompletedPreviousRounds = () => {
    if (!quizData) return 0;
    switch (currentRound) {
      case 1: return 0;
      case 2: return quizData.triadRound1.length;
      case 3: return quizData.triadRound1.length + quizData.triadRound2.length;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      <div className="relative z-10">
        {step === "questions" ? (
          <TriadQuestion
            question={currentQuestionData.text}
            options={currentQuestionData.options}
            onAnswer={handleAnswer}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            currentRound={currentRound}
            totalQuestionsAllRounds={getTotalQuestionsAllRounds()}
            questionsCompletedPreviousRounds={getQuestionsCompletedPreviousRounds()}
          />
        ) : renderStep()}
      </div>
    </div>
  );
};

export default Quiz;