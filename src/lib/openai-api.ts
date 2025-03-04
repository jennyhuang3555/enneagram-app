import OpenAI from 'openai';
import { aiChatPrompt } from './contexts/ai-chat-prompt';
import { diamondApproachContext } from './contexts/diamond-approach';
import { centresChatPrompt } from './contexts/centres-chat-prompt';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToOpenAI = async (messages: ChatMessage[], userTypes: any) => {
  const startTime = performance.now();
  
  try {
    const systemMessage = {
      role: 'system',
      content: `${aiChatPrompt}

ADDITIONAL CONTEXT:
${diamondApproachContext}

The user's Enneagram profile shows:
- Primary Type ${userTypes.dominant}
- Secondary Type ${userTypes.secondary}
- Tertiary Type ${userTypes.tertiary}`
    };

    const allMessages = [systemMessage, ...messages];

    console.log('Sending request to OpenAI:', {
      timestamp: new Date().toISOString(),
      messageCount: allMessages.length,
      lastMessage: allMessages[allMessages.length - 1]
    });

    console.log('System Message Content:', {
      timestamp: new Date().toISOString(),
      systemPrompt: systemMessage.content,
      userTypes
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: allMessages,
      temperature: 0.8,
      max_tokens: 500,
      stream: true
    });

    const endTime = performance.now();
    console.log('OpenAI Response Time:', {
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      timestamp: new Date().toISOString()
    });

    return completion;
  } catch (error: any) {
    console.error('OpenAI API Error:', {
      timestamp: new Date().toISOString(),
      error: error.message,
      status: error.status,
      code: error.code
    });
    throw error;
  }
};

export const sendCentresMessageToOpenAI = async (messages: ChatMessage[], typeNumber: string) => {
  const systemMessage = {
    role: 'system',
    content: `${centresChatPrompt}\n\n${diamondApproachContext}\n\nThe user is exploring Type ${typeNumber}.`
  };
  
  const allMessages = [systemMessage, ...messages];
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: allMessages,
    temperature: 0.8,
    max_tokens: 500,
    stream: true
  });

  return completion;
}; 