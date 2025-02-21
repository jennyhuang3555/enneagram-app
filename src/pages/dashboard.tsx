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

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Top logo section - matches index.tsx */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mb-8 border border-white/40">
          <img 
            src="/images/enneagram-logo.png" 
            alt="Enneagram Symbol"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Welcome message and type info */}
        <h1 className="text-2xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-8">
          Welcome back, {user?.user_metadata?.name || 'User'}!
        </h1>

        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            YOUR ENNEAGRAM TYPE
          </h2>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Type {userProfile?.dominant_type}: {TYPE_NAMES[`type${userProfile?.dominant_type}`]}
          </h3>
          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            {TYPE_DESCRIPTIONS[`type${userProfile?.dominant_type}`]}
          </p>
        </div>

        {/* Main action button */}
        <Button
          className="w-[322px] sm:w-auto py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-[20px] bg-gradient-to-r from-[#9747FF] to-[#FF3BBB] hover:opacity-90 mb-12"
          onClick={handleAIChat}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">
              Chat with AI Coach
            </span>
          </div>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* White container section */}
        <div className="bg-white rounded-3xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
          <div className="max-w-2xl mx-auto text-center space-y-10">
            <h3 className="text-xl font-semibold mb-6">
              Explore your inner world with guided AI coaching sessions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="mb-4">✨</div>
                <h4 className="font-semibold mb-2">Core Motivation</h4>
                <p className="text-sm text-gray-600">How does this drive your behavior?</p>
                <div className="mt-4">→</div>
              </Card>

              <Card className="p-6 bg-pink-50 hover:bg-pink-100 transition-colors">
                <div className="mb-4">🎯</div>
                <h4 className="font-semibold mb-2">Harness Your Strengths</h4>
                <p className="text-sm text-gray-600">Tap into your natural gifts</p>
                <div className="mt-4">→</div>
              </Card>

              <Card className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="mb-4">⚡</div>
                <h4 className="font-semibold mb-2">Growth Path</h4>
                <p className="text-sm text-gray-600">Your journey of transformation</p>
                <div className="mt-4">→</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
