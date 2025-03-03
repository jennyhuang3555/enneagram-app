import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

const TestIntroduction = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Before We Begin</h2>
        
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            This test will help you discover your Enneagram type through a series of carefully crafted questions.
          </p>
          
          <ul className="space-y-2 text-gray-700">
            <li>• Answer each question honestly, reflecting on your life as a whole</li>
            <li>• There are no right or wrong answers</li>
            <li>• Your responses will determine your type calculation</li>
            <li>• The test takes about 15-20 minutes to complete</li>
          </ul>
        </div>

        <Button 
          onClick={onStart}
          className="w-full bg-black hover:bg-gray-800 text-white py-6"
        >
          Begin Test
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TestIntroduction;