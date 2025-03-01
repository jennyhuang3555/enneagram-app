import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import quizData from '@/data/quiz-questions.json';
import { QuestionResponse } from "@/types/quiz";

interface QuestionsProps {
  onComplete: (scores: { [key: string]: number }, responses: QuestionResponse[]) => void;
  onBack: () => void;
}

const INITIAL_SCORES = {
  type1: 0, type2: 0, type3: 0, type4: 0,
  type5: 0, type6: 0, type7: 0, type8: 0, type9: 0
};

const POINTS_FOR_POSITION = {
  0: 3, // First choice
  1: 2, // Second choice
  2: 1  // Third choice
};

const Questions = ({ onComplete, onBack }: QuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>(INITIAL_SCORES);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) return;
    
    const newSelectedOptions = [...selectedOptions, optionId];
    setSelectedOptions(newSelectedOptions);

    if (newSelectedOptions.length === 3) {
      const question = quizData.questions[currentQuestion];
      const newScores = { ...scores };
      
      // Calculate points for each selected option
      newSelectedOptions.forEach((selectedId, index) => {
        const option = question.options.find(opt => opt.id === selectedId);
        if (option) {
          const points = POINTS_FOR_POSITION[index];
          newScores[`type${option.type}`] = (newScores[`type${option.type}`] || 0) + points;
        }
      });

      // Store response
      const response: QuestionResponse = {
        questionId: question.id,
        questionNumber: question.questionNumber,
        selections: newSelectedOptions.map((id, index) => ({
          optionId: id,
          points: POINTS_FOR_POSITION[index]
        }))
      };

      setResponses([...responses, response]);
      setScores(newScores);

      // Move to next question or complete
      if (currentQuestion === quizData.questions.length - 1) {
        onComplete(newScores, responses);
      } else {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOptions([]);
        }, 500);
      }
    }
  };

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h3 className="text-xl font-semibold mb-4">{currentQ.text}</h3>
      <div className="space-y-4">
        {currentQ.options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={selectedOptions.includes(option.id)}
            variant={selectedOptions.includes(option.id) ? "default" : "outline"}
            className="w-full text-left justify-start p-4"
          >
            {option.text}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <p>Question {currentQuestion + 1} of {quizData.questions.length}</p>
        <progress value={progress} max={100} className="w-full" />
      </div>
    </Card>
  );
};

export default Questions;