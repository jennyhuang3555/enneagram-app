import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizOption } from '@/types/quiz';

interface TriadQuestionProps {
  question: string;
  options: QuizOption[];
  onAnswer: (selectedOrder: number[]) => void;
  currentQuestion: number;
  totalQuestions: number;
  currentRound: number;
  totalQuestionsAllRounds: number;
  questionsCompletedPreviousRounds: number;
}

const TriadQuestion = ({
  question,
  options,
  onAnswer,
  currentQuestion,
  totalQuestions,
  currentRound,
  totalQuestionsAllRounds,
  questionsCompletedPreviousRounds,
}: TriadQuestionProps) => {
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  
  // Calculate overall progress including previous rounds
  const overallProgress = ((questionsCompletedPreviousRounds + currentQuestion + 1) / totalQuestionsAllRounds) * 100;

  const handleOptionClick = (index: number) => {
    if (selectedOrder.includes(index)) return;
    
    const newOrder = [...selectedOrder, index];
    setSelectedOrder(newOrder);
  };

  const handleNext = () => {
    if (selectedOrder.length === options.length) {
      onAnswer(selectedOrder);
      setSelectedOrder([]); // Reset for next question
    }
  };

  const getButtonStyle = (index: number) => {
    const orderIndex = selectedOrder.indexOf(index);
    if (orderIndex === -1) return "outline";
    // Use a custom variant for selected state
    return "selected";
  };

  const getButtonText = (index: number) => {
    const orderIndex = selectedOrder.indexOf(index);
    return orderIndex === -1 ? 
      options[index].text : 
      `${orderIndex + 1}. ${options[index].text}`;
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <Progress value={overallProgress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Question {questionsCompletedPreviousRounds + currentQuestion + 1} of {totalQuestionsAllRounds}
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">{question}</h2>
        <div className="space-y-4">
          {options.map((option, index) => (
            <Button
              key={option.id}
              onClick={() => handleOptionClick(index)}
              variant={getButtonStyle(index)}
              className="w-full text-left whitespace-normal h-auto py-4 px-6 justify-start font-normal hover:bg-purple-100"
              style={{
                backgroundColor: selectedOrder.includes(index) ? '#F3E8FF' : '', // Light purple background
                color: 'black' // Keep text black always
              }}
            >
              {getButtonText(index)}
            </Button>
          ))}
        </div>
      </Card>

      <Button 
        onClick={handleNext}
        className="w-full mt-4"
        size="lg"
        disabled={selectedOrder.length !== options.length}
      >
        Next Question
      </Button>
    </div>
  );
};

export default TriadQuestion; 