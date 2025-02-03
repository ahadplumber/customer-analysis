const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables manually
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

// Set environment variables
process.env.OPENAI_API_KEY = envVars.OPENAI_API_KEY;
process.env.ASSISTANT_ID = envVars.ASSISTANT_ID;
process.env.PORT = envVars.PORT;

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Debug environment variables
console.log('Environment variables:', {
    apiKeyLength: process.env.OPENAI_API_KEY?.length,
    apiKeyStart: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
    assistantId: process.env.ASSISTANT_ID
});

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body:', req.body);
    }
    next();
});

// Verify OpenAI connection
async function verifyOpenAIConnection() {
    try {
        console.log('Verifying OpenAI connection...');
        // Try to retrieve the assistant to verify credentials
        const assistant = await openai.beta.assistants.retrieve(process.env.ASSISTANT_ID);
        console.log('Successfully connected to OpenAI. Assistant name:', assistant.name);
        return true;
    } catch (error) {
        console.error('Failed to verify OpenAI connection:', {
            message: error.message,
            type: error.type,
            code: error.code
        });
        return false;
    }
}

// Store threads in memory (in production, use a database)
const threads = new Map();

// Format assistant response for better readability
function formatResponse(response) {
    console.log('Raw response from OpenAI:', response);
    
    // Clean up any markdown/file references but preserve line breaks
    const cleanedResponse = response
        .replace(/\[.*?\.pdf\]/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\[.*?source\]/g, '')
        .replace(/\[.*?gooten_business_summary\.md\]/g, '')
        .trim();
    
    console.log('Cleaned response:', cleanedResponse);

    return {
        mainResponse: cleanedResponse
    };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat/start', async (req, res) => {
    try {
        // Verify connection before creating thread
        const isConnected = await verifyOpenAIConnection();
        if (!isConnected) {
            throw new Error('Failed to connect to OpenAI API');
        }

        console.log('Creating new thread...');
        const thread = await openai.beta.threads.create();
        console.log('Thread created successfully:', thread.id);
        
        // Store thread in memory
        threads.set(thread.id, {
            createdAt: new Date(),
            messages: []
        });
        
        res.json({ threadId: thread.id });
    } catch (error) {
        console.error('Error creating thread:', {
            message: error.message,
            type: error.type,
            code: error.code,
            response: error.response?.data
        });
        
        // Send more specific error message
        res.status(error.status || 500).json({ 
            error: 'Failed to create thread',
            details: error.message,
            code: error.code,
            type: error.type
        });
    }
});

app.post('/api/chat/message', async (req, res) => {
    console.log('Received message request:', req.body);
    
    const { threadId, message } = req.body;
    const assistantId = process.env.ASSISTANT_ID;

    // Validate request
    if (!threadId) {
        console.error('Missing threadId in request');
        return res.status(400).json({ 
            error: 'Missing threadId',
            details: 'threadId is required' 
        });
    }

    if (!message) {
        console.error('Missing message in request');
        return res.status(400).json({ 
            error: 'Missing message',
            details: 'message is required' 
        });
    }

    try {
        console.log(`Processing message for thread ${threadId}`);
        
        // Add the message to the thread
        console.log('Adding message to thread...');
        const threadMessage = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });
        console.log('Message added successfully:', threadMessage.id);

        // Run the assistant
        console.log('Running assistant with ID:', assistantId);
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId
        });
        console.log('Run created:', run.id);

        // Poll for the response
        console.log('Waiting for assistant response...');
        let response;
        let attempts = 0;
        const maxAttempts = 30; // Maximum 30 seconds wait

        while (attempts < maxAttempts) {
            const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            console.log('Run status:', runStatus.status);
            
            if (runStatus.status === 'completed') {
                const messages = await openai.beta.threads.messages.list(threadId);
                const rawResponse = messages.data[0].content[0].text.value;
                const formattedResponse = formatResponse(rawResponse);
                response = formattedResponse;
                break;
            } else if (runStatus.status === 'failed') {
                throw new Error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
            } else if (runStatus.status === 'expired') {
                throw new Error('Run expired');
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!response) {
            throw new Error('Timeout waiting for assistant response');
        }

        console.log('Response received successfully');
        res.json({ response });
    } catch (error) {
        console.error('Error processing message:', {
            message: error.message,
            type: error.type,
            code: error.code,
            response: error.response?.data
        });
        
        // Send more specific error message
        res.status(error.status || 500).json({ 
            error: 'Failed to process message',
            details: error.message,
            code: error.code,
            type: error.type
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    
    // Verify OpenAI connection on startup
    const isConnected = await verifyOpenAIConnection();
    if (!isConnected) {
        console.error('Failed to connect to OpenAI API. Please check your API key and Assistant ID.');
        process.exit(1);
    }
    
    console.log('Environment:', {
        assistantId: process.env.ASSISTANT_ID,
        hasApiKey: !!process.env.OPENAI_API_KEY,
        port: PORT
    });
}); 