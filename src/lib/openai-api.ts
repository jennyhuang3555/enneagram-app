import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToOpenAI = async (messages: ChatMessage[]) => {
  const startTime = performance.now();
  
  try {
    console.log('Sending request to OpenAI:', {
      timestamp: new Date().toISOString(),
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.8,
      max_tokens: 350,
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