import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  messages?: Message[];
}

const AIChat = ({ onSendMessage, isLoading, messages = [] }: AIChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentMessage.trim() || isLoading) return;
    
    await onSendMessage(currentMessage);
    setCurrentMessage("");
  };

  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#0f3e53] via-[#1b647a] to-[#5fb0c1] p-8 shadow-lg">
      <div className="space-y-6">
        <h3 className="text-2xl font-georgia text-white">
          Chat with AI Coach
        </h3>

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
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
                    ? 'bg-white'
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
                handleSendMessage();
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
  );
};

export default AIChat; 