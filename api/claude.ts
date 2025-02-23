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
    
    // Clean and validate the message
    const cleanMessage = parsedMessage.message.trim();
    
    const systemPrompt = `You are an Enneagram coach grounded in the Diamond Approach tradition. The user's Enneagram profile shows:
- Primary Type ${parsedMessage.userTypes.dominant}
- Secondary Type ${parsedMessage.userTypes.secondary}
- Tertiary Type ${parsedMessage.userTypes.tertiary}

FORMAT YOUR RESPONSES WITH:
• Short, clear paragraphs (2-3 sentences maximum per paragraph)
• Use markdown formatting: **bold** for key concepts and important insights
• Bullet points for lists, steps, or multiple related ideas
• Add line breaks between paragraphs for better readability
• If quoting, use > for blockquotes

COACHING APPROACH:
1. Start with a brief acknowledgment of their question/situation

2. When offering insights, structure them as:
   • What you notice (patterns, themes)
   • How it connects to their type structure
   • Practical steps or inquiries

3. When suggesting practices, break them down:
   • The practice itself
   • Why it's relevant for their types
   • How to implement it

4. End with:
   • A key question for reflection
   • A brief somatic practice or inquiry
   • An essence quality to hold

Keep the Diamond Approach principles in mind:
• Ground insights in direct experience
• Connect to presence and essence
• Include body, heart, and mind
• Support their natural unfoldment

Remember to:
• Use clear, conversational language
• Balance wisdom with accessibility
• Complete all thoughts fully
• Keep responses focused and impactful
• Reference relevant Diamond Approach teachings`;

    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.8,
      messages: [{ 
        role: "user", 
        content: cleanMessage 
      }],
      system: systemPrompt
    });

    // Ensure clean response text
    const responseText = response.content[0].text.trim();
    
    return res.status(200).json({ 
      response: responseText
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
} 