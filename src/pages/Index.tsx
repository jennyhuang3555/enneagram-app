import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomeMain = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 88,35 67,52 76,77 50,63 24,77 33,52 12,35 39,35" fill="currentColor"/></svg>')`,
            backgroundSize: '400px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      <nav className="absolute top-6 right-6 z-50">
        <Button 
          className="bg-white hover:bg-gray-900 hover:text-white transition-colors text-gray-900 shadow-sm"
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
      </nav>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-8 border border-white/40">
          <img 
            src="/images/enneagram-logo.png" 
            alt="Enneagram Symbol"
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
          <div className="max-w-2xl mx-auto text-center space-y-10 animate-fadeIn">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Welcome!
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
              To begin working with your AI coach, let's first tailor your experience by uncovering the unique mix of patterns and worldview that drive you
            </p>

            <div className="flex justify-center pt-5">
              <Button
                className="w-[322px] sm:w-auto py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-[20px] bg-gradient-to-r from-[#9747FF] to-[#FF3BBB] hover:opacity-90"
                onClick={() => navigate('/quiz')}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">Discover my Enneagram profile</span>
                </div>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="space-y-4 text-left max-w-xl mx-auto">
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-2xl">🔍</span>
                <span>Uncover hidden drivers behind your decisions, reactions, and emotions</span>
              </p>
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-2xl">🔄</span>
                <span>Recognize patterns and triggers and learn how to shift them</span>
              </p>
              <p className="flex items-start gap-3 text-gray-700">
                <span className="text-2xl">✨</span>
                <span>Gain personalized insights to grow, thrive, and harness your unique gifts</span>
              </p>
            </div>

            <div className="pt-4">
              <p className="text-gray-600 italic">
                "The purpose of the Enneagram is not to put you in a box, but to show you the box you are already in—and how to get out of it."
              </p>
              <p className="text-gray-500 mt-2">- Don Riso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
