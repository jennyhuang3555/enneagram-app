import { ArrowRight, Sparkles, Zap, Shuffle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from "@/lib/firebase";
import { TYPE_NAMES } from "@/lib/constants";

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

const TYPE_CENTERS = {
  head: ['5', '6', '7'],
  heart: ['2', '3', '4'],
  body: ['9', '1', '8']
};

const db = getFirestore(app);

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userType = 4;
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const quizResults = collection(db, 'quiz_results');
        const q = query(quizResults, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          console.log('Fetched quiz results:', data); // Debug log
          setQuizResults(data);
        } else {
          console.log('No quiz results found for user:', user.uid); // Debug log
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        toast({
          title: "Error",
          description: "Failed to load your quiz results. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizResults();
  }, [user]);

  const handleAIChat = () => {
    toast({
      title: "Coming Soon",
      description: "AI chat functionality will be available soon!",
    });
  };

  const formatTypeNumber = (typeNumber: string | undefined) => {
    if (!typeNumber) return '...';
    return `Type ${typeNumber}`;
  };

  const formatTypeName = (typeNumber: string | undefined) => {
    if (!typeNumber) return '...';
    return TYPE_NAMES[typeNumber as keyof typeof TYPE_NAMES];
  };

  const getCenterEmoji = (center: string) => {
    switch (center) {
      case 'head': return '🧠';
      case 'heart': return '💝';
      case 'body': return '⚡';
      default: return '✨';
    }
  };

  const formatCenterTitle = (center: string) => {
    return `${center.charAt(0).toUpperCase() + center.slice(1)} Centre`;
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

        {/* Welcome message and subtitle */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-8">
          Welcome to your Inner Mirror
        </h1>
        <h3 className="text-xl font-semibold mb-2">
          Explore your dominant types
        </h3>
        <p className="text-base text-gray-600 mb-8">
          {user?.displayName || 'User'}, your highest scoring Enneagram types are
        </p>

        {/* Type information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-[1000px]">
          <Card 
            className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/type${quizResults?.dominant_type}`)}
          >
            <div className="mb-4">🎯</div>
            <h4 className="font-semibold mb-2">Primary Type</h4>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {formatTypeNumber(quizResults?.dominant_type)}
            </p>
            <p className="text-xl text-purple-500">
              {formatTypeName(quizResults?.dominant_type)}
            </p>
          </Card>

          <Card 
            className="p-6 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/${quizResults?.second_type}`)}
          >
            <div className="mb-4">💫</div>
            <h4 className="font-semibold mb-2">Secondary Type</h4>
            <p className="text-3xl font-bold text-pink-600 mb-1">
              {formatTypeNumber(quizResults?.second_type)}
            </p>
            <p className="text-xl text-pink-500">
              {formatTypeName(quizResults?.second_type)}
            </p>
          </Card>

          <Card 
            className="p-6 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate(`/type-deepdive/${quizResults?.third_type}`)}
          >
            <div className="mb-4">✨</div>
            <h4 className="font-semibold mb-2">Third Type</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-1">
              {formatTypeNumber(quizResults?.third_type)}
            </p>
            <p className="text-xl text-indigo-500">
              {formatTypeName(quizResults?.third_type)}
            </p>
          </Card>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed mb-8 text-center">
          {TYPE_DESCRIPTIONS[`type${userProfile?.dominant_type}`]}
        </p>

        {/* Main action button */}
        <Button
          className="w-[322px] sm:w-auto py-6 group transition-all duration-300 hover:translate-y-[-4px] text-white flex items-center justify-center shadow-lg rounded-[20px] bg-gradient-to-r from-[#9747FF] to-[#FF3BBB] hover:opacity-90 mb-12"
          onClick={() => navigate('/ai-coach')}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-base sm:text-xl font-semibold text-center whitespace-normal px-4">
              Chat with AI Coach
            </span>
          </div>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Centers Introduction */}
        <h3 className="text-xl font-semibold mb-2">
          Explore your centres
        </h3>
        <p className="text-base text-gray-600 mb-8">
          {(() => {
            if (!quizResults) return 'Your triadic style is loading...';
            
            // Get scores for each center's type
            const headScore = quizResults.scores[`type${quizResults.head_type}`] || 0;
            const heartScore = quizResults.scores[`type${quizResults.heart_type}`] || 0;
            const bodyScore = quizResults.scores[`type${quizResults.body_type}`] || 0;
            
            // Create array of {type, score} objects
            const centerScores = [
              { type: quizResults.head_type, score: headScore, label: 'head' },
              { type: quizResults.heart_type, score: heartScore, label: 'heart' },
              { type: quizResults.body_type, score: bodyScore, label: 'body' }
            ];
            
            // Sort by score (highest to lowest)
            const sortedCenters = centerScores.sort((a, b) => b.score - a.score);
            
            // Create triadic style string
            const triadStyle = sortedCenters.map(center => center.type).join('-');
            
            return `Your triadic style is ${triadStyle}`;
          })()}
        </p>

        {/* Centers Section */}
        <div className="w-full max-w-[1000px] space-y-6 mb-12">
          {['head', 'heart', 'body'].map((center) => (
            <div key={center} className="flex flex-col md:flex-row gap-6">
              {/* Gradient Card */}
              <div className="w-full md:w-1/3 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                <div className="mb-4">{getCenterEmoji(center)}</div>
                <h4 className="text-xl font-semibold mb-2">{formatCenterTitle(center)}</h4>
                <p className="text-sm text-gray-600">Your dominant type in this center</p>
              </div>

              {/* Type Information */}
              <div className="w-full md:w-2/3 bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-xl font-semibold mb-2">
                  Type {quizResults?.[`${center}_type`]}: {formatTypeName(quizResults?.[`${center}_type`])}
                </h4>
                <p className="text-gray-600 mb-4">
                  {TYPE_DESCRIPTIONS[`type${quizResults?.[`${center}_type`]}`]}
                </p>
                <Button
                  variant="ghost"
                  className="group"
                  onClick={() => navigate(`/centres/${quizResults?.[`${center}_type`]}`)}
                >
                  Learn more 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

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
