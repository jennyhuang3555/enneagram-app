import { ArrowRight, Sparkles, Zap, Shuffle, LogOut, ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app, db } from "@/lib/firebase";
import { TYPE_NAMES } from "@/lib/constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const cardGradients = {
  purple: "bg-gradient-to-br from-purple-100/80 to-purple-50/50",
  blue: "bg-gradient-to-br from-blue-100/80 to-blue-50/50",
  pink: "bg-gradient-to-br from-pink-100/80 to-pink-50/50",
  yellow: "bg-gradient-to-br from-yellow-100/80 to-yellow-50/50"
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const userType = 4;
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dominantType, setDominantType] = useState<string | null>(null);

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
          setDominantType(data.dominant_type?.toString() || "1");
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

  const handleNavigation = (path: string) => {
    if (!dominantType) {
      console.error("User type not loaded");
      return;
    }
    navigate(`${path}/${dominantType}`);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,35 88,35 67,52 76,77 50,63 24,77 33,52 12,35 39,35" fill="currentColor"/></svg>')`,
          backgroundSize: '400px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

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
        <p className="text-xl font-georgia text-gray-600 mb-8">
          {user?.displayName || 'User'}, your highest scoring Enneagram types are
        </p>

        {/* Type information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-[1000px]">
          <Card className={`p-6 ${cardGradients.purple}`}>
            <div className="flex flex-col h-full">
              <div>
                <div className="mb-4">🎯</div>
                <h4 className="font-semibold mb-2">Primary Type</h4>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatTypeNumber(quizResults?.dominant_type)}
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {formatTypeName(quizResults?.dominant_type)}
                </p>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="group text-purple-500 hover:text-purple-600 transition-colors"
                  onClick={() => navigate(`/type-deepdive/type${quizResults?.dominant_type}`)}
                >
                  Learn more 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${cardGradients.blue}`}>
            <div className="flex flex-col h-full">
              <div>
                <div className="mb-4">💫</div>
                <h4 className="font-semibold mb-2">Secondary Type</h4>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatTypeNumber(quizResults?.second_type)}
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {formatTypeName(quizResults?.second_type)}
                </p>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="group text-purple-500 hover:text-purple-600 transition-colors"
                  onClick={() => navigate(`/type-deepdive/type${quizResults?.second_type}`)}
                >
                  Learn more 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${cardGradients.pink}`}>
            <div className="flex flex-col h-full">
              <div>
                <div className="mb-4">✨</div>
                <h4 className="font-semibold mb-2">Third Type</h4>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatTypeNumber(quizResults?.third_type)}
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {formatTypeName(quizResults?.third_type)}
                </p>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="group text-purple-500 hover:text-purple-600 transition-colors"
                  onClick={() => navigate(`/type-deepdive/type${quizResults?.third_type}`)}
                >
                  Learn more 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
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
        <p className="text-xl font-georgia text-gray-600 mb-2">Your triadic style</p>
        <h2 className="text-4xl font-bold text-purple-600 mb-8">
          {(() => {
            if (!quizResults) return '...';
            
            const headScore = quizResults.scores[`type${quizResults.head_type}`] || 0;
            const heartScore = quizResults.scores[`type${quizResults.heart_type}`] || 0;
            const bodyScore = quizResults.scores[`type${quizResults.body_type}`] || 0;
            
            const centerScores = [
              { type: quizResults.head_type, score: headScore, label: 'head' },
              { type: quizResults.heart_type, score: heartScore, label: 'heart' },
              { type: quizResults.body_type, score: bodyScore, label: 'body' }
            ];
            
            const sortedCenters = centerScores.sort((a, b) => b.score - a.score);
            const triadStyle = sortedCenters.map(center => center.type).join('-');
            
            return triadStyle;
          })()}
        </h2>

        {/* Centers Section */}
        <div className="w-full max-w-[1000px] space-y-6 mb-12">
          {['head', 'heart', 'body'].map((center, index) => (
            <div key={center} className="flex flex-col md:flex-row gap-6">
              <div className={`w-full md:w-1/3 p-6 rounded-xl ${
                index % 3 === 0 ? cardGradients.purple :
                index % 3 === 1 ? cardGradients.blue :
                cardGradients.pink
              }`}>
                <div className="mb-4">{getCenterEmoji(center)}</div>
                <h4 className="text-xl font-semibold mb-2">{formatCenterTitle(center)}</h4>
                <p className="text-xl font-georgia text-gray-700 leading-relaxed">
                  Your dominant type in this center
                </p>
              </div>

              <div className="w-full md:w-2/3 bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col h-full">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      Type {quizResults?.[`${center}_type`]}: {formatTypeName(quizResults?.[`${center}_type`])}
                    </h4>
                    <p className="text-xl font-georgia text-gray-700 leading-relaxed">
                      {TYPE_DESCRIPTIONS[`type${quizResults?.[`${center}_type`]}`]}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      className="group text-purple-500 hover:text-purple-600 transition-colors"
                      onClick={() => navigate(`/centres/${quizResults?.[`${center}_type`]}`)}
                    >
                      Learn more 
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* White container section */}
        <div className="bg-white rounded-3xl shadow-xl max-w-[1000px] mx-auto w-full p-12 relative">
          <div className="max-w-2xl mx-auto text-center space-y-10">
            <h3 className="text-xl font-semibold mb-6">
              Growth paths for your core type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/corefear')}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden h-64">
                  <div className="mb-4">✨</div>
                  <h4 className="font-semibold mb-2">Core Fear</h4>
                  <p className="text-xl font-georgia text-gray-700 leading-relaxed">
                    What drives your deepest anxieties?
                  </p>
                  <div className="mt-4">→</div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/triggers')}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden h-64">
                  <div className="mb-4">🎯</div>
                  <h4 className="font-semibold mb-2">Key Triggers</h4>
                  <p className="text-xl font-georgia text-gray-700 leading-relaxed">
                    Understanding your reactive patterns
                  </p>
                  <div className="mt-4">→</div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/spiritual-gift')}
                className="cursor-pointer"
              >
                <Card className="relative overflow-hidden h-64">
                  <div className="mb-4">⚡</div>
                  <h4 className="font-semibold mb-2">Spiritual Gift</h4>
                  <p className="text-xl font-georgia text-gray-700 leading-relaxed">
                    Your unique contribution
                  </p>
                  <div className="mt-4">→</div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Reflection Prompts Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8 rounded-2xl bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] p-8 shadow-lg text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md">
              <Calendar className="w-5 h-5 text-[#F97316]" />
            </div>
            <h3 className="text-2xl font-georgia text-black mb-2 pr-14">
              Daily Reflection Prompt
            </h3>
            <p className="text-lg text-black/80 leading-relaxed mb-6 font-georgia">
              {(() => {
                const prompts: Record<string, string> = {
                  '1': "How does your inner critic influence your pursuit of improvement?",
                  '2': "When do you find yourself prioritizing others' needs over your own?",
                  '3': "What does success mean to you beyond external achievements?",
                  '4': "How do you balance authenticity with belonging?",
                  '5': "When do you choose knowledge over experience?",
                  '6': "How does your vigilance serve and limit you?",
                  '7': "What lies beneath your pursuit of new experiences?",
                  '8': "When do you protect others at the cost of vulnerability?",
                  '9': "How does your desire for peace affect your self-expression?"
                };
                return prompts[quizResults?.dominant_type] || "What patterns do you notice in your daily interactions?";
              })()}
            </p>
            <Button 
              className="group bg-white hover:bg-[#F97316] text-[#F97316] hover:text-white px-6 py-2 text-md h-auto font-medium shadow-md transition-all duration-300 flex items-center gap-2"
            >
              Journal Response
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
