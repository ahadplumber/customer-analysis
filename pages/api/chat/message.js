import OpenAI from 'openai';

// Configure API route
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true
  }
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const MAX_RETRIES = 60; // Maximum number of retries (60 seconds)
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

export default async function handler(req, res) {
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        console.error('Invalid method:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error('Missing OpenAI API key');
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        if (!process.env.ASSISTANT_ID) {
            console.error('Missing Assistant ID');
            return res.status(500).json({ error: 'Assistant ID not configured' });
        }

        const { threadId, message } = req.body;
        
        if (!threadId || !message) {
            console.error('Missing required fields:', { threadId: !!threadId, message: !!message });
            return res.status(400).json({ error: 'Missing threadId or message' });
        }

        console.log('Adding message to thread:', { threadId, message });
        // Add the user's message to the thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });

        console.log('Running assistant...');
        // Run the assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: process.env.ASSISTANT_ID
        });

        // Poll for the completion with timeout
        let retries = 0;
        while (retries < MAX_RETRIES) {
            console.log('Checking run status... (attempt ${retries + 1}/${MAX_RETRIES})');
            const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            console.log('Run status:', runStatus.status);
            
            if (runStatus.status === 'completed') {
                // Get the assistant's response
                const messages = await openai.beta.threads.messages.list(threadId);
                const response = messages.data[0].content[0].text.value;
                console.log('Got response:', response);
                return res.json({ response });
            } else if (runStatus.status === 'failed') {
                console.error('Run failed:', runStatus);
                throw new Error('Assistant run failed: ' + runStatus.last_error?.message || 'Unknown error');
            } else if (runStatus.status === 'expired') {
                console.error('Run expired:', runStatus);
                throw new Error('Assistant run expired');
            }
            
            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            retries++;
        }

        // If we get here, we've timed out
        throw new Error('Request timed out waiting for assistant response');
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ 
            error: 'Failed to process chat message',
            details: error.message
        });
    }
} 