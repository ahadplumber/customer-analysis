import { openai } from '@/app/lib/openai';
import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Starting chat initialization...');
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('Assistant ID exists:', !!process.env.ASSISTANT_ID);
  
  try {
    console.log('Creating thread...');
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);
    
    return NextResponse.json({
      threadId: thread.id
    });
  } catch (error) {
    console.error('Chat Start Error:', error);
    // Log the full error for debugging
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { error: 'Failed to start chat' },
      { status: 500 }
    );
  }
} 