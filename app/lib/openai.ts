import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.ASSISTANT_ID) {
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