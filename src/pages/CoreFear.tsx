import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChatSection from "@/components/AIChatSection";
import AIChat from "@/components/AIChat";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendMessageToOpenAI } from "@/lib/openai-api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CoreFear = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSection = () => {
    setIsExpanded(prev => !prev);
  };

  const section = {
    title: "Core Fear and Avoidance Pattern",
    content: "At your type's core lies a fundamental fear of being inadequate, defective, or somehow fundamentally flawed. This deep-seated belief manifests as a constant underlying anxiety about not being enough or not meeting essential standards. To manage this fear, you've developed sophisticated patterns of preparation, analysis, and self-improvement—always working to shore up your sense of capability and competence.",
    expandedContent: "This core fear often shows up as a relentless inner critic that questions your readiness and capability. You might find yourself constantly gathering information, seeking certainty, and trying to prepare for every possibility. While this can lead to genuine expertise and valuable insights, it can also keep you trapped in cycles of overthinking and hesitation. The avoidance pattern typically manifests as a tendency to withdraw into analysis and preparation rather than taking action, especially in situations where you feel uncertain or exposed. This can look like excessive research, endless planning, or seeking multiple confirmations before moving forward. While these strategies may have served a protective function in the past, they can now limit your ability to engage fully with life and trust your natural capabilities.",
    gradient: "bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10"
  };

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      const userMessage = { role: "user", content };
      setMessages(prev => [...prev, userMessage]);

      const stream = await sendMessageToOpenAI([...messages, userMessage], {
        dominant: user?.dominant_type,
        secondary: user?.second_type,
        tertiary: user?.third_type
      });

      let accumulatedResponse = '';
      
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          accumulatedResponse += chunk.choices[0].delta.content;
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: accumulatedResponse 
      }]);

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-500 via-blue-400 to-orange-200 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-normal text-white mb-6 font-georgia"
            >
              Core Fear
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-white/90 font-georgia"
            >
              Understanding your deepest patterns
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-2xl shadow-lg overflow-hidden ${section.gradient}`}
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              {section.title}
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-black/80 font-georgia leading-relaxed">
                {section.content}
              </p>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg text-black/80 font-georgia leading-relaxed pt-4">
                      {section.expandedContent}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={toggleSection}
                className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors"
              >
                <span className="text-sm font-georgia">
                  {isExpanded ? "Read less" : "Read more"}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Explanatory Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 space-y-8 text-center max-w-3xl mx-auto"
        >
          <p className="text-lg text-black/80 leading-relaxed">
            Your type's core fear is a deep-seated concern that shapes the way you see the world and interact with it. It's the underlying reason behind many of your thoughts, emotions, and behaviors. This fear drives your avoidance pattern—the strategies you unconsciously use to stay safe and comfortable, even if they sometimes hold you back.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black">Why This Matters:</h3>
            <ul className="text-lg text-black/80 space-y-2">
              <li>Understanding these patterns helps you break free from automatic reactions, leading to more conscious choices.</li>
              <li>By exploring these fears somatically (through your body), you can release tensions bound up with these patterns and access greater emotional freedom.</li>
            </ul>
          </div>

          {/* Updated CTA Section with new gradient background using the teal blue colors */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0f3e53] via-[#1b647a] to-[#5fb0c1] p-12 shadow-lg">
            <div className="space-y-6">
              <h3 className="text-2xl font-georgia text-white">
                Try a Somatically Guided Voice AI Session
              </h3>
              <Button 
                className="bg-white hover:bg-white/90 text-[#1b647a] px-8 py-6 text-lg h-auto font-semibold shadow-lg"
              >
                Start Session
              </Button>
            </div>
          </div>
          
          {/* Reflection Prompts Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 mb-8 rounded-2xl bg-gradient-to-br from-[#FDE1D3] to-[#FEC6A1] p-8 shadow-lg text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md">
              <Calendar className="w-5 h-5 text-[#F97316]" />
            </div>
            <h3 className="text-2xl font-georgia text-black mb-2 pr-14">
              Daily Reflection Prompt
            </h3>
            <p className="text-lg text-black/80 leading-relaxed mb-6 font-georgia">
              When was the last time you noticed your core fear influencing a decision? How might you respond differently next time?
            </p>
            <Button 
              className="group bg-white hover:bg-[#F97316] text-[#F97316] hover:text-white px-6 py-2 text-md h-auto font-medium shadow-md transition-all duration-300 flex items-center gap-2"
            >
              Journal Response
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Add this section at the bottom, before closing main tag */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <AIChat 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            messages={messages}
          />
        </motion.div>
      </div>
    </main>
  );
};

export default CoreFear;
