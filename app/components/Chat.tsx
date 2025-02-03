import React, { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeChat() {
      try {
        const response = await fetch('/api/chat/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to initialize chat');
        }

        const data = await response.json();
        setThreadId(data.threadId);
      } catch (error) {
        console.error('Chat initialization error:', error);
        setError('Failed to initialize chat');
      } finally {
        setIsInitializing(false);
      }
    }

    initializeChat();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || !threadId) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          threadId: threadId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isInitializing) {
    return (
      <div className="fixed right-8 bottom-8 w-96 bg-white rounded-lg shadow-xl p-4">
        <p className="text-center text-gray-600">Initializing chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed right-8 bottom-8 w-96 bg-white rounded-lg shadow-xl p-4">
        <p className="text-center text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-8 bottom-8 w-96 bg-white rounded-lg shadow-xl">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Journey Map Assistant</h2>
        <p className="text-sm text-gray-500">Ask me about the user journey</p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg mr-8">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>

      <div className="px-4 py-2 text-xs text-center text-gray-500 border-t">
        AI Chat is in Test Mode. It can make mistakes.
      </div>
    </div>
  );
} 