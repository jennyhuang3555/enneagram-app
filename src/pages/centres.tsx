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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {description.title}
          </h2>

          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Overview
              </h3>
              <p className="text-base text-gray-600">{description.centerOverview}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Type Expression
              </h3>
              <p className="text-base text-gray-600">{description.typeInContext}</p>
              <p className="text-base text-gray-600 mt-4">{description.typeComparison}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Mental Pattern
              </h3>
              <p className="text-base text-gray-600">{description.mentalPattern}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Core Struggle
              </h3>
              <p className="text-base text-gray-600">{description.coreStruggle}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Common Phrases
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {description.commonPhrases.map((phrase, index) => (
                  <li key={index} className="text-base text-gray-600">{phrase}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Hidden Fears
              </h3>
              <p className="text-base text-gray-600">{description.hiddenFears}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Key Challenge
              </h3>
              <p className="text-base text-gray-600">{description.keyChallenge}</p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Spiritual Lesson
              </h3>
              <p className="text-base text-gray-600">{description.spiritualLesson}</p>
            </section>
          </div>

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
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="How do you relate to this?"
                className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-purple-500 p-2 text-white disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CentresPage; 