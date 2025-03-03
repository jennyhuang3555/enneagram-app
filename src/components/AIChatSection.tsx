import { Button } from "@/components/ui/button";
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useNavigate } from "react-router-dom";

interface AIChatSectionProps {
  title?: string;
  buttonText?: string;
}

const AIChatSection = ({ 
  title = "Try a Somatically Guided Voice AI Session",
  buttonText = "Start Session"
}: AIChatSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0f3e53] via-[#1b647a] to-[#5fb0c1] p-12 shadow-lg">
      <div className="space-y-6">
        <h3 className="text-2xl font-georgia text-white">
          {title}
        </h3>
        <Button 
          onClick={() => navigate('/ai-chat')}
          className="bg-white hover:bg-white/90 text-[#1b647a] px-8 py-6 text-lg h-auto font-semibold shadow-lg"
        >
          {buttonText}
          <VoiceRecorder className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AIChatSection; 