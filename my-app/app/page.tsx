'use client';

import React from 'react';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Journey Analysis</h1>
      <div className="grid gap-6">
        <section className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Journey Map</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Visualize and analyze customer journeys to identify pain points and opportunities.
          </p>
          <Chat />
        </section>
        
        <section className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get AI-powered insights from customer feedback and journey data.
          </p>
        </section>
      </div>
    </main>
  );
}
