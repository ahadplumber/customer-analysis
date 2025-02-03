import { openai, ASSISTANT_ID } from '../../lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/chat - Starting request');
    
    const { messages, threadId } = await req.json();
    console.log('Request payload:', { threadId, messageCount: messages.length });

    let currentThreadId = threadId;

    // Create a new thread if one doesn't exist
    if (!currentThreadId) {
      console.log('No thread ID provided, creating new thread');
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log('New thread created:', currentThreadId);
    }

    // Add the user's message to the thread
    console.log('Adding user message to thread');
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: messages[messages.length - 1].content
    });

    // Run the assistant
    console.log('Starting assistant run');
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: ASSISTANT_ID
    });

    // Wait for the run to complete
    console.log('Waiting for assistant response');
    let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        console.error('Run failed:', runStatus);
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      console.log('Run status:', runStatus.status);
    }

    // Get the assistant's response
    console.log('Retrieving assistant response');
    const messages_response = await openai.beta.threads.messages.list(currentThreadId);
    const lastMessage = messages_response.data[0];
    const messageContent = lastMessage.content[0];

    // Check if the content is text
    if (messageContent.type !== 'text') {
      throw new Error('Unexpected message content type');
    }

    console.log('Successfully generated response');
    return NextResponse.json({
      response: messageContent.text.value,
      threadId: currentThreadId
    });
  } catch (error: any) {
    console.error('Chat API Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      status: error.status,
      type: error.type,
      code: error.code
    });

    return NextResponse.json(
      { 
        error: 'Failed to generate chat response',
        details: error.message
      },
      { status: 500 }
    );
  }
} 