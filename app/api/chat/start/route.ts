import { openai } from '../../../lib/openai';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Log the request
    console.log('POST /api/chat/start - Starting request');
    
    // Log environment variables (safely)
    const apiKey = process.env.OPENAI_API_KEY || '';
    const assistantId = process.env.ASSISTANT_ID || '';
    const hasApiKey = !!apiKey;
    const hasAssistantId = !!assistantId;
    
    console.log('Environment check:', {
      hasApiKey,
      hasAssistantId,
      apiKeyLastChars: hasApiKey ? apiKey.slice(-4) : 'none',
      assistantId
    });

    // Create thread
    console.log('Creating OpenAI thread...');
    const thread = await openai.beta.threads.create();
    console.log('Thread created successfully:', thread.id);

    return NextResponse.json({
      threadId: thread.id,
      status: 'success'
    });
  } catch (error: any) {
    // Detailed error logging
    console.error('Chat Start Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      status: error.status,
      type: error.type,
      code: error.code
    });

    return NextResponse.json(
      { 
        error: 'Failed to start chat',
        details: error.message
      },
      { status: 500 }
    );
  }
} 