import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ onSearch, isLoading, placeholder = "Search for movies..." }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch(''); // Trigger search with empty query to show trending
  };

  // Debounced search
  useEffect(() => {
    if (query.trim() === '') {
      return;
    }

    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`
          relative flex items-center bg-[#121212] border rounded-full p-1.5 
          transition-all duration-300
          ${isFocused ? 'border-accent shadow-red-glow' : 'border-red-900/30 shadow-red-glow/50'}
        `}
      >
        <div className="pl-4 pr-2 text-gray-400">
          <FiSearch className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-400 px-2 py-3 focus:outline-none"
          disabled={isLoading}
        />

        {query && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <FiX className="w-5 h-5" />
          </motion.button>
        )}

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`
            btn-red rounded-full px-5 py-3 flex items-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
            </>
          ) : (
            <>
              <FiSearch className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </div>

      {/* Search suggestions or status */}
      {query && !isLoading && (
        <motion.div
          className="absolute top-full mt-2 left-0 right-0 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Press Enter or wait to search for "{query}"
        </motion.div>
      )}
    </motion.form>
  );
}

