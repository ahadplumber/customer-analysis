import React from 'react';
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Copy your existing journey map HTML here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Journey Map</h1>
        {/* Add your journey map content here */}
      </div>
      
      {/* Chat component */}
      <Chat />
    </main>
  );
} 