import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AICoachPrep = () => {
  const navigate = useNavigate();

  const checklistItems = [
    {
      text: "I'm able to set aside at least 10 minutes",
      icon: "⏰"
    },
    {
      text: "I'm in a quiet and comfortable environment",
      icon: "🏡"
    },
    {
      text: "I'm keeping a curious and open mind to my inner world",
      icon: "❤️"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
      <div className="relative z-10 max-w-2xl mx-auto pt-12">
        <Card className="p-8 space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Preparation
          </h1>

          <div className="space-y-6">
            {checklistItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg bg-purple-50"
              >
                <div className="bg-purple-500 rounded-full p-2">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg text-gray-700">
                  {item.text} {item.icon}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate('/ai-chat')}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
          >
            Start Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AICoachPrep; 