const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3000/api/claude'
  : '/api/claude';

export const sendMessageToClaude = async (message: string) => {
  try {
    console.log('Sending message to Claude:', message);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response:', errorData);
      throw new Error('Failed to get response from AI coach');
    }

    const data = await response.json();
    console.log('Claude response:', data);
    return data.response;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}; 