import OpenAI from 'openai';

// Log environment variable status
console.log('Environment check on startup:');
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? '****' + process.env.OPENAI_API_KEY.slice(-4) : 'not set');
console.log('Assistant ID:', process.env.ASSISTANT_ID || 'not set');

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API Key is missing!');
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.ASSISTANT_ID) {
  console.error('Assistant ID is missing!');
  throw new Error('Missing ASSISTANT_ID environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ASSISTANT_ID = process.env.ASSISTANT_ID;

export const chatConfig = {
  model: "gpt-4-1106-preview",
  temperature: 0.7,
  max_tokens: 1000,
}; 