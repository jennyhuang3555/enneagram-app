import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sendMessageToClaude } from "@/lib/claude-api";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuizResults {
  dominant_type: string;
  second_type: string;
  third_type: string;
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
  const { user } = useAuth();
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedText, setCurrentStreamedText] = useState("");
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (!user) return;
      
      try {
        const db = getFirestore();
        const quizResults = collection(db, 'quiz_results');
        const q = query(quizResults, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setQuizResults(data as QuizResults);
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };

    fetchQuizResults();
  }, [user]);

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
    setIsStreaming(true);
    setCurrentStreamedText("");
    
    const streamNextChar = () => {
      if (index < text.length) {
        setCurrentStreamedText(prev => prev + text[index]);
        index++;
        streamIntervalRef.current = setTimeout(streamNextChar, 30);
      } else {
        clearInterval(streamIntervalRef.current!);
        streamIntervalRef.current = null;
        setCurrentStreamedText("");
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
        setIsLoading(false);
        setIsStreaming(false);
      }
    };

    streamIntervalRef.current = setTimeout(streamNextChar, 30);
  };

  const handleSendMessage = async (content: string) => {
    try {
      setInputMessage("");
      setIsLoading(true);
      setIsStreaming(true);
      setChatStarted(true);
      
      const userMessage: Message = { role: "user", content };
      setMessages(prev => [...prev, userMessage]);
      
      const contextualizedMessage = {
        message: content,
        userTypes: {
          dominant: quizResults?.dominant_type,
          secondary: quizResults?.second_type,
          tertiary: quizResults?.third_type
        }
      };
      
      const response = await sendMessageToClaude(JSON.stringify(contextualizedMessage));
      const cleanResponse = response.trim();
      simulateStreaming(cleanResponse);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI coach. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handlePause = () => {
    if (streamIntervalRef.current) {
      clearTimeout(streamIntervalRef.current);
      streamIntervalRef.current = null;
      // When paused, add current progress to messages and reset streaming
      setMessages(prev => [...prev, { role: "assistant", content: currentStreamedText }]);
      setStreamingText("");
      setIsLoading(false);
      setIsStreaming(false);
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
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white text-gray-800 px-4 py-2 rounded-lg">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentStreamedText}
                </ReactMarkdown>
              </div>
              <span className="ml-1 animate-pulse">▊</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Modified Input Area */}
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
            disabled={isStreaming}
          />
          
          {isStreaming ? (
            <Button 
              type="button"
              onClick={handlePause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 rounded-lg w-24"
            >
              Pause
            </Button>
          ) : (
            <Button 
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg w-24"
            >
              Send
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIChatScreen; 