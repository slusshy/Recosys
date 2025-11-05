import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAIRecommendation } from '../../hooks/useAIRecommendation';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import RecommendationCard from './RecommendationCard';

export default function AIChatRecommendation() {
  const chatEndRef = useRef(null);
  const {
    isLoading,
    error,
    chatHistory,
    recommendations,
    userPreferences,
    getRecommendations,
    clearChat,
    updateUserProfile,
  } = useAIRecommendation();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Welcome message on first visit
  useEffect(() => {
    if (!userPreferences.lastVisit) {
      getRecommendations("Hi! I'm looking for recommendations.");
    }
  }, [userPreferences.lastVisit]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-[#111]">
      <div className="container-max py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaRobot className="text-4xl text-accent" />
            <h1 className="text-3xl font-bold">
              AI <span className="text-accent">Recommendations</span>
            </h1>
          </div>
          
          <p className="text-gray-400">
            {userPreferences.name 
              ? `Welcome back, ${userPreferences.name}! `
              : 'Hello! '}
            Ask me anything - I'll find the perfect recommendations for you.
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl rounded-2xl border border-red-900/20 p-4 sm:p-6">
            {/* Chat Controls */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={clearChat}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <FaTrash /> Clear Chat
              </button>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence>
                {chatHistory.map((message, index) => (
                  <ChatBubble
                    key={index}
                    message={message}
                    isUser={message.role === 'user'}
                  />
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput
              onSubmit={getRecommendations}
              isLoading={isLoading}

            />
          </div>

          {/* Recommendations Grid */}
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold mb-6">
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((item, index) => (
                  <RecommendationCard
                    key={item.id}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}