import { ArrowRight, Sparkles, Zap, Shuffle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const TYPE_NAMES = {
  type1: "The Reformer",
  type2: "The Helper",
  type3: "The Achiever",
  type4: "The Individualist",
  type5: "The Investigator",
  type6: "The Loyalist",
  type7: "The Enthusiast",
  type8: "The Challenger",
  type9: "The Peacemaker"
};

const TYPE_DESCRIPTIONS = {
  type1: "Principled, purposeful, self-controlled, and perfectionistic",
  type2: "Generous, demonstrative, people-pleasing, and possessive",
  type3: "Adaptable, excelling, driven, and image-conscious",
  type4: "Expressive, dramatic, self-absorbed, and temperamental",
  type5: "Perceptive, innovative, secretive, and isolated",
  type6: "Engaging, responsible, anxious, and suspicious",
  type7: "Spontaneous, versatile, acquisitive, and scattered",
  type8: "Self-confident, decisive, willful, and confrontational",
  type9: "Receptive, reassuring, complacent, and resigned"
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userType = 4;
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile({
        ...data,
        name: user.user_metadata?.name || 'User'
      });
    };

    fetchUserProfile();
  }, [user]);

  const handleAIChat = () => {
    toast({
      title: "Coming Soon",
      description: "AI chat functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />

      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Welcome back, {userProfile?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">
            View your quiz history and track your progress
          </p>
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
              <h2 className="text-2xl font-semibold text-gray-800">
                Type {userProfile?.dominant_type}: {TYPE_NAMES[`type${userProfile?.dominant_type}`]}
              </h2>
              <p className="text-gray-700 max-w-md mx-auto text-base">
                {TYPE_DESCRIPTIONS[`type${userProfile?.dominant_type}`]}
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
    </div>
  );
};

export default Dashboard;
