import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface QuizQuestionProps {
  question: string;
  currentQuestion: number;
  totalQuestions: number;
  onNext: (score: number) => void;
  onPrevious: () => void;
}

const ANSWER_OPTIONS = [
  { label: "Strongly Disagree", score: 0 },
  { label: "Disagree", score: 1 },
  { label: "Neutral", score: 2 },
  { label: "Agree", score: 3 },
  { label: "Strongly Agree", score: 4 },
];

const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  onNext,
  onPrevious,
}: QuizQuestionProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleOptionSelect = (score: number) => {
    if (selectedOrder.includes(score)) {
      // Remove from selection
      setSelectedOrder(selectedOrder.filter(s => s !== score));
    } else {
      // Add to selection
      setSelectedOrder([...selectedOrder, score]);
    }
    setSelectedScore(score);
  };

  const getSelectionNumber = (score: number) => {
    const index = selectedOrder.indexOf(score);
    return index !== -1 ? index + 1 : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 glass-card space-y-6">
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-base mb-2">
            Answer with your whole life in view, for how you are most of the time.
          </p>
          <div className="flex justify-between items-center text-sm text-gray-600">
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

        <h3 className="text-xl font-semibold text-center py-4">{question}</h3>

        <div className="grid gap-3">
          {ANSWER_OPTIONS.map((option) => {
            const selectionNumber = getSelectionNumber(option.score);
            return (
              <Button
                key={option.score}
                variant={selectedScore === option.score ? "default" : "outline"}
                className={`w-full min-h-[80px] justify-start p-4 text-left text-lg relative ${
                  selectedOrder.includes(option.score)
                    ? "bg-black text-white"
                    : "hover:bg-gray-50 border-blue-400/30 hover:border-blue-400/50"
                }`}
                onClick={() => handleOptionSelect(option.score)}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="whitespace-normal pr-8">{option.label}</span>
                  {selectionNumber !== null && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                      {selectionNumber}
                    </span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1 bg-gray-100 hover:bg-gray-200 border-gray-200"
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => {
              if (selectedScore !== null) {
                onNext(selectedScore);
                setSelectedScore(null);
              }
            }}
            disabled={selectedScore === null}
            className="flex-1 bg-black hover:bg-gray-800 text-white transition-colors duration-200"
          >
            Next
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;