import React from 'react';
import { motion } from 'framer-motion';

export default function ChatBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 
          ${isUser 
            ? 'bg-accent text-white ml-auto' 
            : 'bg-[#1a1a1a] border border-red-900/20'
          }
        `}
      >
        <p className="text-sm sm:text-base">{message.content}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  );
}