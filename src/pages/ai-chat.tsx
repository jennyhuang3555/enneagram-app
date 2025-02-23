import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendMessageToClaude } from "@/lib/claude-api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TypingIndicator = () => (
  <div className="flex space-x-2 p-4">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const AIChatScreen = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const conversationStarters = [
    {
      title: "Help me unpack a pattern",
      description: "Explore recurring behaviors"
    },
    {
      title: "Help me get unstuck",
      description: "Break through barriers"
    },
    {
      title: "Help me clarify feelings",
      description: "Understand emotions"
    },
    {
      title: "Why do I do XYZ?",
      description: "Explore motivations"
    }
  ];

  const simulateStreaming = (text: string) => {
    let index = 0;
    setStreamingText("");
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setStreamingText("");
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
        setIsLoading(false);
      }
    }, 30);
  };

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setChatStarted(true);
      
      const userMessage: Message = { role: "user", content };
      setMessages(prev => [...prev, userMessage]);
      
      const response = await sendMessageToClaude(content);
      simulateStreaming(response);
      
      setInputMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI coach. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">Enneagram Coach</h1>
        <div className="w-[64px]" /> {/* Spacer for centering */}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!chatStarted && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {conversationStarters.map((starter, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(starter.title)}
                className="bg-white rounded-full px-6 py-3 shadow hover:shadow-md transition-shadow duration-200 text-sm"
              >
                {starter.title}
              </button>
            ))}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <span className="text-sm">🤖</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white ml-2'
                  : 'bg-white text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && streamingText && (
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
              <span className="text-sm">🤖</span>
            </div>
            <div className="max-w-[80%] bg-white text-gray-800 px-4 py-2 rounded-lg">
              {streamingText}
              <span className="ml-1 animate-pulse">▊</span>
            </div>
          </div>
        )}
        {isLoading && !streamingText && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (inputMessage.trim()) {
              handleSendMessage(inputMessage);
            }
          }}
          className="flex gap-2 max-w-4xl mx-auto"
        >
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatScreen; 