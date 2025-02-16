
import { ArrowRight, Sparkles, Zap, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userType = 4;
  const isMobile = useIsMobile();

  const handleAIChat = () => {
    toast({
      title: "Coming Soon",
      description: "AI chat functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#E5DEFF] via-[#FDE1D3] to-[#D3E4FD]/20">
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

      <div className="relative px-4 py-8 space-y-8">
        <section className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-4 border border-white/40">
            <img 
              src="/lovable-uploads/d6cccfc5-2a9b-4e74-bb4e-9394fc534f2b.png" 
              alt="Enneagram Symbol"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-800/70 tracking-wide">YOUR ENNEAGRAM TYPE</h4>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Type {userType}: The Individualist</h1>
            <p className="text-gray-700 max-w-md mx-auto text-base">
              Creative, sensitive, and expressive, you seek authenticity and depth in life's experiences.
            </p>
          </div>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <Button
            className="w-[322px] py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-[20px] bg-gradient-to-r from-[#9747FF] to-[#FF3BBB] hover:opacity-90 mx-auto"
            onClick={() => navigate('/explore')}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">
                Learn about my type
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Button>
        </section>

        <div className="bg-white rounded-3xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Explore your inner world with guided AI coaching sessions
          </h2>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Explore Your Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Core Motivation",
                  description: "How does this drive your behavior?",
                  href: "/motivation",
                  gradient: "from-[#E5DEFF]/60 to-[#D3E4FD]/60",
                  icon: Sparkles,
                },
                {
                  title: "Harness Your Strengths",
                  description: "Tap into your natural gifts",
                  href: "/strengths",
                  gradient: "from-[#FDE1D3]/60 to-[#FEC6A1]/60",
                  icon: Sparkles,
                },
                {
                  title: "Growth Path",
                  description: "Your journey of transformation",
                  href: "/growth",
                  gradient: "from-[#D3E4FD]/60 to-[#E5DEFF]/60",
                  icon: Zap,
                },
              ].map((card) => (
                <Card 
                  key={card.title}
                  className={`relative p-6 cursor-pointer hover:translate-y-[-4px] transition-all duration-300 overflow-hidden bg-gradient-to-br ${card.gradient} backdrop-blur-md border border-white/40 shadow-lg rounded-[20px]`}
                  style={{
                    aspectRatio: isMobile ? '1.67/1' : '1/1',
                  }}
                  onClick={() => navigate(card.href)}
                >
                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <card.icon className="w-6 h-6 text-gray-800" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2 text-gray-900">{card.title}</h3>
                        <p className="text-sm text-gray-700">{card.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-700 self-end" />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4 mt-12">
            <h2 className="text-lg font-semibold text-gray-900">Need immediate guidance?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { 
                  icon: Sparkles, 
                  label: "Resolve Stuck Feelings",
                  gradient: "from-[#D3E4FD]/60 to-[#E5DEFF]/60",
                },
                { 
                  icon: Zap, 
                  label: "Work with a Pattern",
                  gradient: "from-[#FDE1D3]/60 to-[#FEC6A1]/60",
                },
                { 
                  icon: Shuffle, 
                  label: "Make a Decision",
                  gradient: "from-[#F2FCE2]/60 to-[#E5DEFF]/60",
                },
              ].map(({ icon: Icon, label, gradient }) => (
                <Card
                  key={label}
                  className={`p-6 cursor-pointer hover:translate-y-[-4px] transition-all duration-300 bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/40 shadow-lg rounded-[20px]`}
                  onClick={handleAIChat}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <Icon className="w-6 h-6 text-gray-800" />
                      </div>
                      <p className="text-base font-medium text-gray-800">{label}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-700 self-end" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
