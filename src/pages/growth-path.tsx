import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { growthPathsContent } from "@/data/growthPathsContent";
import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface GrowthPathProps {
  pathType: keyof typeof growthPathsContent;
}

const GrowthPathPage = ({ pathType }: GrowthPathProps) => {
  const { typeNumber } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const content = growthPathsContent[pathType]?.[typeNumber || ''];

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

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="mb-8 p-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {content.title}
          </h2>
          <p className="text-gray-600 mb-6">{content.description}</p>

          {/* Render content based on pathType */}
          {pathType === 'core-fear' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Key Points</h3>
              <ul className="list-disc pl-5 space-y-2">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {pathType === 'triggers' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Common Triggers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {content.commonTriggers.map((trigger, index) => (
                    <li key={index} className="text-gray-600">{trigger}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Coping Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {content.copingStrategies.map((strategy, index) => (
                    <li key={index} className="text-gray-600">{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {pathType === 'spiritual-gift' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Manifestations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {content.manifestations.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-600 italic">{content.developmentPath}</p>
            </div>
          )}
        </Card>

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
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
    </div>
  );
};

export default GrowthPathPage; 