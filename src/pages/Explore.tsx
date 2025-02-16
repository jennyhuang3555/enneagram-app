
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "In a Nutshell",
    content: [
      "Creative and sensitive soul who seeks authenticity",
      "Driven by a deep need for self-expression and meaning",
      "Values individuality and emotional depth",
      "Yearns to find personal significance and identity"
    ]
  },
  {
    title: "Motivation and Core Fears",
    content: [
      "Core Motivation: To understand themselves and find personal significance",
      "Fear of being ordinary or lacking personal significance",
      "Fear of not having a unique identity",
      "Desire to express their authentic self"
    ]
  },
  {
    title: "Worldview and Focus of Attention",
    content: [
      "Sees the world through an emotional and personal lens",
      "Highly attuned to meaning, depth, and authenticity",
      "Focused on what's missing or ideal",
      "Drawn to intensity and symbolic significance"
    ]
  },
  {
    title: "Strengths and Gifts",
    content: [
      "Deep emotional awareness and empathy",
      "Creative self-expression",
      "Ability to find meaning in experiences",
      "Authentic and genuine in relationships"
    ]
  },
  {
    title: "Triggers",
    content: [
      "Feeling misunderstood or overlooked",
      "Perceived lack of depth in relationships",
      "Comparison with others",
      "Criticism of their self-expression"
    ]
  },
  {
    title: "Blind Spots",
    content: [
      "Over-identification with emotions",
      "Tendency to dramatize experiences",
      "Difficulty with practical matters",
      "Resistance to ordinary experiences"
    ]
  },
  {
    title: "Challenging Patterns",
    content: [
      "Getting lost in melancholy or fantasy",
      "Withdrawing when feeling misunderstood",
      "Difficulty maintaining emotional equilibrium",
      "Comparing self to idealized images"
    ]
  },
  {
    title: "Growth Questions",
    content: [
      "What simple joys am I overlooking?",
      "How can I balance emotion with practicality?",
      "When do I need to let go of intensity?",
      "How can I embrace ordinary moments?"
    ]
  }
];

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E5DEFF] via-[#FDE1D3] to-white/20">
      {/* Faint Enneagram Symbol Background */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 88,35 67,52 76,77 50,63 24,77 33,52 12,35 39,35" fill="currentColor"/></svg>')`,
          backgroundSize: '400px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-8 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Type 4</h1>
          <p className="text-gray-600 text-lg mb-8">Explore your inner world with guided AI coaching sessions</p>
          
          <Button
            className="w-[322px] py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-[20px] bg-gradient-to-r from-[#9747FF] to-[#FF3BBB] hover:opacity-90"
            onClick={() => navigate('/assessment')}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">
                Explore your type
              </span>
            </div>
          </Button>
        </div>

        {/* Main content in white container */}
        <div className="bg-white rounded-3xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
          <Carousel className="w-full relative">
            <CarouselContent>
              {sections.map((section, index) => (
                <CarouselItem key={index}>
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg rounded-[20px]">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">{section.title}</h2>
                    <ul className="space-y-4">
                      {section.content.map((point, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-block w-2 h-2 mt-2 mr-3 bg-gray-300 rounded-full" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          <div className="mt-8 text-center text-sm text-gray-500">
            Swipe or use arrow keys to navigate
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
