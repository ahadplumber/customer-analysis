const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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

        console.log('Creating new thread...');
        const thread = await openai.beta.threads.create();
        console.log('Created thread:', thread.id);
        res.json({ threadId: thread.id });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ 
            error: 'Failed to create chat thread',
            details: error.message
        });
    }
}; 