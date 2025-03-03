import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import quizData from '@/data/quiz-questions.json';
import { QuestionResponse } from "@/types/quiz";

interface QuestionsProps {
  onComplete: (
    scores: { [key: string]: number }, 
    responses: QuestionResponse[],
    round1TopThree: string[],
    round2TopTwo: string[]
  ) => void;
  onBack: () => void;
}

const INITIAL_SCORES = {
  type1: 0, type2: 0, type3: 0, type4: 0,
  type5: 0, type6: 0, type7: 0, type8: 0, type9: 0
};

const ROUND1_POINTS = {
  0: 3, // First choice
  1: 2, // Second choice
  2: 1  // Last choice
};

const ROUND2_POINTS = {
  0: 2, // First choice
  1: 1, // Second choice
  2: 0  // Last choice
};

const ROUND3_POINTS = {
  0: 1, // First choice
  1: 0  // Second choice
};

const Questions = ({ onComplete, onBack }: QuestionsProps) => {
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>(INITIAL_SCORES);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [topThreeTypes, setTopThreeTypes] = useState<string[]>([]);
  const [round2Questions, setRound2Questions] = useState<any[]>([]);
  const [round3Questions, setRound3Questions] = useState<any[]>([]);
  const [topTwoTypes, setTopTwoTypes] = useState<string[]>([]);

  // Get current question based on round
  const getCurrentQuestion = () => {
    if (currentRound === 1) {
      return quizData.round1.questions[currentQuestion];
    }
    if (currentRound === 2) {
      return round2Questions[currentQuestion];
    }
    return round3Questions[currentQuestion];
  };

  // Calculate top three types from round 1
  const calculateTopThreeTypes = (roundScores: { [key: string]: number }) => {
    return Object.entries(roundScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([type]) => type.replace('type', ''));
  };

  // Filter and prepare round 2 questions
  const prepareRound2Questions = (topTypes: string[]) => {
    const round2Raw = quizData.round2.rawQuestions;
    const filteredQuestions = {};
    
    round2Raw.forEach((row: any) => {
      const questionNumber = row['Question Number'];
      const type = row['Types'].replace('Type ', '');
      
      if (topTypes.includes(type)) {
        if (!filteredQuestions[questionNumber]) {
          filteredQuestions[questionNumber] = [];
        }
        filteredQuestions[questionNumber].push({
          statement: row['Statements'],
          type: type
        });
      }
    });

    return Object.entries(filteredQuestions).map(([questionNumber, statements]: [string, any[]]) => ({
      id: crypto.randomUUID(),
      questionNumber: parseInt(questionNumber),
      text: "Select in order of what you most agree with",
      options: statements.map(statement => ({
        id: crypto.randomUUID(),
        text: statement.statement,
        type: statement.type
      }))
    })).sort((a, b) => a.questionNumber - b.questionNumber);
  };

  // Filter and prepare round 3 questions
  const prepareRound3Questions = (topTypes: string[]) => {
    const round3Raw = quizData.round3.rawQuestions;
    const filteredQuestions = {};
    
    round3Raw.forEach((row: any) => {
      const questionNumber = row['Question Number'];
      const type = row['Types'].replace('Type ', '');
      
      if (topTypes.includes(type)) {
        if (!filteredQuestions[questionNumber]) {
          filteredQuestions[questionNumber] = [];
        }
        filteredQuestions[questionNumber].push({
          statement: row['Statements'],
          type: type
        });
      }
    });

    return Object.entries(filteredQuestions).map(([questionNumber, statements]: [string, any[]]) => ({
      id: crypto.randomUUID(),
      questionNumber: parseInt(questionNumber),
      text: "Select in order of what you most agree with",
      options: statements.map(statement => ({
        id: crypto.randomUUID(),
        text: statement.statement,
        type: statement.type
      }))
    })).sort((a, b) => a.questionNumber - b.questionNumber);
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) return;
    
    const newSelectedOptions = [...selectedOptions, optionId];
    setSelectedOptions(newSelectedOptions);

    const currentQ = getCurrentQuestion();
    const pointsSystem = currentRound === 1 ? ROUND1_POINTS : 
                        currentRound === 2 ? ROUND2_POINTS : 
                        ROUND3_POINTS;

    const requiredSelections = currentRound === 3 ? 2 : 3;
    if (newSelectedOptions.length === requiredSelections) {
      const newScores = { ...scores };
      
      // Calculate points for each selected option
      newSelectedOptions.forEach((selectedId, index) => {
        const option = currentQ.options.find(opt => opt.id === selectedId);
        if (option) {
          const points = pointsSystem[index];
          newScores[`type${option.type}`] = (newScores[`type${option.type}`] || 0) + points;
        }
      });

      // Store response
      const response: QuestionResponse = {
        questionId: currentQ.id,
        questionNumber: currentQ.questionNumber,
        round: currentRound,
        questionText: currentQ.text,
        selections: newSelectedOptions.map((id, index) => {
          const option = currentQ.options.find(opt => opt.id === id);
          return {
            optionId: id,
            optionText: option?.text || '',
            type: option?.type || '',
            points: pointsSystem[index]
          };
        }),
        timestamp: Date.now()
      };

      setResponses([...responses, response]);
      setScores(newScores);
    }
  };

  const handleNext = () => {
    if (selectedOptions.length !== (currentRound === 3 ? 2 : 3)) return;

    if (currentRound === 1 && currentQuestion === quizData.round1.questions.length - 1) {
      // Complete round 1
      const topTypes = calculateTopThreeTypes(scores);
      setTopThreeTypes(topTypes);
      const round2Qs = prepareRound2Questions(topTypes);
      setRound2Questions(round2Qs);
      setCurrentRound(2);
      setCurrentQuestion(0);
      setSelectedOptions([]);
    } else if (currentRound === 2 && currentQuestion === round2Questions.length - 1) {
      // Complete round 2 and prepare round 3
      const topTypes = calculateTopTwoTypes(scores);
      setTopTwoTypes(topTypes);
      const round3Qs = prepareRound3Questions(topTypes);
      setRound3Questions(round3Qs);
      setCurrentRound(3);
      setCurrentQuestion(0);
      setSelectedOptions([]);
    } else if (currentRound === 3 && currentQuestion === round3Questions.length - 1) {
      // Complete quiz with round1 and round2 top types
      onComplete(scores, responses, topThreeTypes, topTwoTypes);
    } else {
      // Next question
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    }
  };

  // Calculate top two types function
  const calculateTopTwoTypes = (roundScores: { [key: string]: number }) => {
    return Object.entries(roundScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 2)
      .map(([type]) => type.replace('type', ''));
  };

  const currentQ = getCurrentQuestion();
  const totalQuestions = currentRound === 1 
    ? quizData.round1.questions.length 
    : currentRound === 2 ? round2Questions.length : round3Questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-blue-400 to-orange-200 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">{currentQ.text}</h3>
      <div className="space-y-4">
        {currentQ.options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={selectedOptions.includes(option.id)}
            variant={selectedOptions.includes(option.id) ? "default" : "outline"}
            className={`w-full min-h-[80px] justify-start p-4 text-left text-lg relative ${
              selectedOptions.includes(option.id)
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-50 border-blue-400/30 hover:border-blue-400/50"
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="whitespace-normal pr-8">{option.text}</span>
              {selectedOptions.includes(option.id) && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                  {selectedOptions.indexOf(option.id) + 1}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 border-gray-200"
          disabled={currentQuestion === 0 && currentRound === 1}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className={`flex-1 transition-colors duration-200 ${
            selectedOptions.length === (currentRound === 3 ? 2 : 3)
              ? "bg-black hover:bg-gray-800 text-white"
              : "bg-blue-600 text-white opacity-70"
          }`}
          disabled={selectedOptions.length !== (currentRound === 3 ? 2 : 3)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

export default Questions;