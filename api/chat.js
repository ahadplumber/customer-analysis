const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialize chat thread
router.post('/start', async (req, res) => {
    try {
        const thread = await openai.beta.threads.create();
        console.log('Created thread:', thread.id);
        res.json({ threadId: thread.id });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ error: 'Failed to create chat thread' });
    }
});

// Handle chat messages
router.post('/message', async (req, res) => {
    try {
        const { threadId, message } = req.body;
        
        if (!threadId || !message) {
            return res.status(400).json({ error: 'Missing threadId or message' });
        }

        // Add the user's message to the thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: process.env.ASSISTANT_ID
        });

        // Poll for the completion
        let response;
        while (true) {
            const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            if (runStatus.status === 'completed') {
                // Get the assistant's response
                const messages = await openai.beta.threads.messages.list(threadId);
                response = messages.data[0].content[0].text.value;
                break;
            } else if (runStatus.status === 'failed') {
                throw new Error('Assistant run failed');
            }
            // Wait before polling again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.json({ response });
    } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

module.exports = router; 