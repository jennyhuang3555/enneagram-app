import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const parsedMessage = JSON.parse(message);
    
    const systemPrompt = `You are an AI coach helping users understand their Enneagram journey. 
    The user's primary type is Type ${parsedMessage.userTypes.dominant}, 
    with Type ${parsedMessage.userTypes.secondary} and Type ${parsedMessage.userTypes.tertiary} influences.
    Keep responses concise, personal, and focused on their specific type combination.
    Frame your responses through the lens of their core three types.`;

    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: parsedMessage.message }],
      system: systemPrompt
    });

    return res.status(200).json({ response: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
} 