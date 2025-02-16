
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface IntroPageProps {
  title: string;
  description: string;
  onStart: () => void;
  imagePath?: string;
}

export const IntroPage = ({ title, description, onStart, imagePath }: IntroPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5DEFF] via-[#FDE1D3] to-[#D3E4FD]/20 px-4 py-8 animate-fadeIn">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 mb-8 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      
      <div className="max-w-md mx-auto space-y-8">
        {imagePath && (
          <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden bg-white/30 backdrop-blur-sm border border-white/40">
            <img src={imagePath} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          <div 
            className="text-gray-700 whitespace-pre-wrap leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: description
                .split('\n\n')
                .map(paragraph => 
                  paragraph
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                )
                .join('<br /><br />')
            }}
          />
          
          <div className="pt-6">
            <Button
              className="w-full py-6 text-lg group transition-all duration-300 bg-white/80 hover:bg-white/90 backdrop-blur-sm text-gray-900 border border-white/40"
              onClick={onStart}
            >
              I'm Ready
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
