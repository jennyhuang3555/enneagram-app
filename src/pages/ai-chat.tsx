import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendMessageToClaude } from "@/lib/claude-api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatScreen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const { toast } = useToast();

  const conversationStarters = [
    {
      title: "Unpack a Pattern",
      description: "Explore recurring behaviors or thoughts"
    },
    {
      title: "Explore a Trigger",
      description: "Understand what activates your stress responses"
    },
    {
      title: "Growth Opportunities",
      description: "Discover areas for personal development"
    },
    {
      title: "Relationship Dynamics",
      description: "Examine your interactions with others"
    }
  ];

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setChatStarted(true);
      
      const userMessage: Message = { role: "user", content };
      setMessages(prev => [...prev, userMessage]);
      
      const response = await sendMessageToClaude(content);
      
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      setInputMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI coach. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#E5DEFF] from-40% via-[#FDE1D3] via-80% to-[#D3E4FD]/20" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-8">
          {!chatStarted ? (
            <>
              <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                What can I help you with?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conversationStarters.map((starter, index) => (
                  <Card 
                    key={index}
                    className="p-6 hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleSendMessage(starter.title)}
                  >
                    <h3 className="text-xl font-semibold mb-2 text-purple-700">
                      {starter.title}
                    </h3>
                    <p className="text-gray-600">
                      {starter.description}
                    </p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4 mb-8">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Card className="p-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Send
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatScreen; 