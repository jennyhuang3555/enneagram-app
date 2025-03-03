import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomeMain = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-500 via-blue-400 to-orange-200 py-20 px-4 min-h-screen">
          <nav className="absolute top-6 right-6 z-50">
            <Button 
              className="bg-black hover:bg-gray-800 text-white transition-colors text-xl font-georgia rounded-lg"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </nav>

          <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-8 border border-white/40">
              <img 
                src="/images/enneagram-logo.png" 
                alt="Enneagram Symbol"
                className="w-12 h-12 object-contain"
              />
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
              <div className="max-w-2xl mx-auto text-center space-y-10 animate-fadeIn">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  Welcome!
                </h1>

                <p className="text-xl font-georgia text-gray-700 max-w-xl mx-auto leading-relaxed">
                  To begin working with your AI coach, let's first tailor your experience by uncovering the unique mix of patterns and worldview that drive you
                </p>

                <div className="flex justify-center pt-5">
                  <Button
                    className="w-[322px] sm:w-auto py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-lg bg-black hover:bg-gray-800"
                    onClick={() => navigate('/quiz')}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">Discover my Enneagram profile</span>
                    </div>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="space-y-4 text-left max-w-xl mx-auto">
                  <p className="flex items-start gap-3 text-xl font-georgia text-gray-700">
                    <span className="text-2xl">🔍</span>
                    <span>Uncover hidden drivers behind your decisions, reactions, and emotions</span>
                  </p>
                  <p className="flex items-start gap-3 text-xl font-georgia text-gray-700">
                    <span className="text-2xl">🔄</span>
                    <span>Recognize patterns and triggers and learn how to shift them</span>
                  </p>
                  <p className="flex items-start gap-3 text-xl font-georgia text-gray-700">
                    <span className="text-2xl">✨</span>
                    <span>Gain personalized insights to grow, thrive, and harness your unique gifts</span>
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-xl font-georgia italic text-gray-600">
                    "The purpose of the Enneagram is not to put you in a box, but to show you the box you are already in—and how to get out of it."
                  </p>
                  <p className="text-xl font-georgia text-gray-500 mt-2">- Don Riso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
