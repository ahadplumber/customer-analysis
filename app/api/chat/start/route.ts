import { openai } from '@/app/lib/openai';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const thread = await openai.beta.threads.create();
    
    return NextResponse.json({
      threadId: thread.id
    });
  } catch (error) {
    console.error('Chat Start Error:', error);
    return NextResponse.json(
      { error: 'Failed to start chat' },
      { status: 500 }
    );
  }
} 