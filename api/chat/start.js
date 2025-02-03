const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const thread = await openai.beta.threads.create();
        console.log('Created thread:', thread.id);
        res.json({ threadId: thread.id });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ error: 'Failed to create chat thread' });
    }
}; 