import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInput({ onSubmit, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative"
      initial={false}
    >
      <motion.input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask for recommendations... (e.g., 'Show me sci-fi movies')"
        className="w-full px-6 py-4 bg-[#111] border border-red-900/20 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] focus:shadow-red-glow focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300"
        disabled={isLoading}
        initial={false}
        animate={{ 
          opacity: isLoading ? 0.7 : 1,
          scale: isLoading ? 0.99 : 1
        }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-16 top-1/2 -translate-y-1/2"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}