import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessageToOpenAI } from '@/lib/openai-api';
import { VoiceRecorder } from '@/components/VoiceRecorder';

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
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
      setError(null);

      const userMessage = { role: 'user', content };
      
      // Keep only the last 10 messages plus the new one
      const recentMessages = messages.slice(-10);
      const allMessages = [...recentMessages, userMessage];
      
      setMessages(prev => [...prev, userMessage]);

      // Include system prompt in the API call
      const systemPrompt = {
        role: 'system',
        content: `You are an Enneagram coach. The user's types are: Dominant: ${quizResults?.dominant_type}, Secondary: ${quizResults?.second_type}, Tertiary: ${quizResults?.third_type}.`
      };

      const stream = await sendMessageToOpenAI([systemPrompt, ...allMessages], {
        dominant: quizResults?.dominant_type,
        secondary: quizResults?.second_type,
        tertiary: quizResults?.third_type
      });

      let accumulatedResponse = '';

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          accumulatedResponse += chunk.choices[0].delta.content;
          setCurrentStreamedText(accumulatedResponse);
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: accumulatedResponse 
      }]);

    } catch (error: any) {
      console.error('Chat error:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        userId: user?.uid
      });
      
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setCurrentStreamedText('');
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
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-strong:text-gray-900">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({node, ...props}) => (
                      <span className="font-bold text-gray-900" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="mb-4" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="my-4 ml-4 list-disc space-y-2" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="my-1 pl-1" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isStreaming && currentStreamedText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white text-gray-800 px-4 py-2 rounded-lg">
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-strong:text-gray-900">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({node, ...props}) => (
                      <span className="font-bold text-gray-900" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="mb-4" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="my-4 ml-4 list-disc space-y-2" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="my-1 pl-1" {...props} />
                    ),
                  }}
                >
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
          className="flex gap-2 max-w-4xl mx-auto items-center"
        >
          <div className="flex-1 flex gap-2">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isStreaming}
            />
            
            <VoiceRecorder
              onTranscription={(text) => {
                setInputMessage(text);
                handleSendMessage(text);
              }}
              isDisabled={isStreaming}
            />
          </div>
          
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIChatScreen; 