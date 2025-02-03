import OpenAI from 'openai';

// Log environment variable status
console.log('Environment check on startup:');
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('Assistant ID exists:', !!process.env.ASSISTANT_ID);

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API Key is missing!');
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.ASSISTANT_ID) {
  console.error('Assistant ID is missing!');
  throw new Error('Missing ASSISTANT_ID environment variable');
}

let openaiClient: OpenAI;
let assistantId: string;

try {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  assistantId = process.env.ASSISTANT_ID;
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  throw error;
}

export const openai = openaiClient;
export const ASSISTANT_ID = assistantId;
export const chatConfig = {
  model: "gpt-4-1106-preview",
  temperature: 0.7,
  max_tokens: 1000,
}; 