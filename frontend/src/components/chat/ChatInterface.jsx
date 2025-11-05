import React, { useState, useRef } from 'react';
import ChatInput from './ChatInput';
import RecommendationResults from './RecommendationResults';
import api from '../../api/axios';

export default function ChatInterface() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const processQuery = async (query) => {
    setLoading(true);
    try {
      const response = await api.post('/recommendations/', { query });
      setRecommendations(response.data.results || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat-interface" className="py-12 sm:py-16">
      <div className="container-max">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">
            AI <span className="text-accent">Recommendations</span>
          </h2>
          <p className="mt-2 muted">
            Ask me anything - I'll find the perfect recommendations for you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ChatInput onSubmit={processQuery} isLoading={loading} />
        </div>

        {(loading || recommendations.length > 0) && (
          <div className="mt-12">
            <RecommendationResults 
              results={recommendations}
              isLoading={loading}
            />
          </div>
        )}

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}