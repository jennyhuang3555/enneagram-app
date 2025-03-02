import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { growthPathsContent } from "@/data/growthPathsContent";
import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { sendCentresMessageToOpenAI } from '@/lib/openai-api';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface GrowthPathProps {
  pathType: keyof typeof growthPathsContent;
}

const GrowthPathPage = ({ pathType }: GrowthPathProps) => {
  const { dominant_type: typeNumber } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const content = growthPathsContent[pathType]?.[typeNumber || '1'];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const stream = await sendCentresMessageToOpenAI([...messages, userMessage], typeNumber || "");
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
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = () => {
    setIsExpanded(prev => !prev);
  };

  if (!content) {
    return <div>Loading...</div>;
  }

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
              {content.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Overview
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-black/80 font-georgia leading-relaxed">
                {content.description}
              </p>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {pathType === 'core-fear' && (
                      <ul className="list-disc pl-5 space-y-2 mt-4 text-lg text-black/80 font-georgia">
                        {content.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {pathType === 'triggers' && (
                      <>
                        <h3 className="text-xl font-semibold mt-6 mb-3 font-georgia">Common Triggers</h3>
                        <ul className="list-disc pl-5 space-y-2 text-lg text-black/80 font-georgia">
                          {content.commonTriggers.map((trigger, index) => (
                            <li key={index}>{trigger}</li>
                          ))}
                        </ul>
                        <h3 className="text-xl font-semibold mt-6 mb-3 font-georgia">Coping Strategies</h3>
                        <ul className="list-disc pl-5 space-y-2 text-lg text-black/80 font-georgia">
                          {content.copingStrategies.map((strategy, index) => (
                            <li key={index}>{strategy}</li>
                          ))}
                        </ul>
                      </>
                    )}
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

        <div className="bg-white rounded-lg shadow p-6">
          <div ref={chatContainerRef} className="space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'assistant'
                      ? 'bg-gray-100'
                      : 'bg-purple-100'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              
              <VoiceRecorder
                onTranscription={(text) => {
                  setCurrentMessage(text);
                  handleSendMessage(text);
                }}
                isDisabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !currentMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default GrowthPathPage; 