import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { isFavorite, toggleFavorite } from '../utils/favorites';

export default function FavoriteButton({ movie, onToggle, className = '' }) {
  const [isFav, setIsFav] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(movie.id));
  }, [movie.id]);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    setIsAnimating(true);
    const newStatus = toggleFavorite(movie);
    setIsFav(newStatus);
    
    // Call parent callback if provided
    if (onToggle) {
      onToggle(newStatus);
    }
    
    // Reset animation
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        p-2 rounded-full transition-all duration-300
        ${isFav 
          ? 'bg-accent/20 text-accent hover:bg-accent/30' 
          : 'bg-black/50 text-white hover:bg-black/70'
        }
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <FiHeart 
          className={`w-5 h-5 transition-all ${isFav ? 'fill-accent' : ''}`}
        />
      </motion.div>
    </motion.button>
  );
}

