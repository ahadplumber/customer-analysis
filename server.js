require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const chatRouter = require('./api/chat');

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
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

// API routes
app.use('/api/chat', chatRouter);

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    console.log(`Open http://localhost:${port} in your browser`);
    
    // Verify OpenAI connection on startup
    const isConnected = await verifyOpenAIConnection();
    if (!isConnected) {
        console.error('Failed to connect to OpenAI API. Please check your API key and Assistant ID.');
        process.exit(1);
    }
    
    console.log('Environment:', {
        assistantId: process.env.ASSISTANT_ID,
        hasApiKey: !!process.env.OPENAI_API_KEY,
        port: port
    });
}); 