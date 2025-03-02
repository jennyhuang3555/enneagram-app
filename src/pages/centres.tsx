import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { centreDescriptions } from "@/data/centreDescriptions";
import { TYPE_CENTERS } from "@/lib/constants";
import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { diamondApproachContext } from "@/lib/contexts/diamond-approach";
import { centresChatPrompt } from "@/lib/contexts/centres-chat-prompt";
import { sendCentresMessageToOpenAI } from "@/lib/openai-api";
import ReactMarkdown from 'react-markdown';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { motion } from "framer-motion";

const CentresPage = () => {
  const { typeNumber } = useParams();
  const navigate = useNavigate();

  // Determine which center this type belongs to
  const getCenterForType = (type: string) => {
    for (const [center, types] of Object.entries(TYPE_CENTERS)) {
      if (types.includes(type)) {
        return center;
      }
    }
    return null;
  };

  const center = getCenterForType(typeNumber || "");
  const description = centreDescriptions[typeNumber || ""]?.[center as keyof typeof centreDescriptions[string]];

  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
          // Optional: Add streaming UI here
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

  if (!description) {
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
              {description.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-white/90 font-georgia"
            >
              Understanding your center of intelligence
            </motion.p>
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

        {/* Overview Section */}
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
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.centerOverview}
            </p>
          </div>
        </motion.section>

        {/* Type Expression Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Type Expression
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-black/80 font-georgia leading-relaxed">
                {description.typeInContext}
              </p>
              <p className="text-lg text-black/80 font-georgia leading-relaxed">
                {description.typeComparison}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Mental Pattern Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Mental Pattern
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.mentalPattern}
            </p>
          </div>
        </motion.section>

        {/* Core Struggle Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Core Struggle
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.coreStruggle}
            </p>
          </div>
        </motion.section>

        {/* Common Phrases Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Common Phrases
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {description.commonPhrases.map((phrase, index) => (
                <li key={index} className="text-lg text-black/80 font-georgia leading-relaxed">{phrase}</li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Hidden Fears Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Hidden Fears
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.hiddenFears}
            </p>
          </div>
        </motion.section>

        {/* Key Challenge Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Key Challenge
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.keyChallenge}
            </p>
          </div>
        </motion.section>

        {/* Spiritual Lesson Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-400/10 to-orange-200/10 mb-8"
        >
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-normal mb-6 text-black font-georgia">
              Spiritual Lesson
            </h2>
            <p className="text-lg text-black/80 font-georgia leading-relaxed">
              {description.spiritualLesson}
            </p>
          </div>
        </motion.section>

        {/* Chat Container */}
        <div className="mt-12 border-t pt-8">
          <div ref={chatContainerRef} className="space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-100'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => (
                            <p className="mb-4 last:mb-0">{children}</p>
                          ),
                          ul: ({children}) => (
                            <ul className="my-4 ml-4 list-disc space-y-2">{children}</ul>
                          ),
                          li: ({children}) => (
                            <li className="my-1 pl-1">{children}</li>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
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

export default CentresPage; 