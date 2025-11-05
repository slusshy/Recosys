import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';

export default function RecommendationCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: index * 0.1 }
      }}
      whileHover={{ y: -5 }}
      className="card group overflow-hidden"
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 relative">
        <img
          src={item.image || 'https://picsum.photos/300/450'}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {item.rating && (
          <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-sm flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            {item.rating}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
        
        {item.genre && (
          <div className="text-sm text-accent">{item.genre}</div>
        )}
        
        <p className="text-sm text-gray-400 line-clamp-3">
          {item.description}
        </p>

        <div className="pt-4 flex gap-2">
          {item.type === 'movie' && (
            <a
              href={`https://www.imdb.com/find?q=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red text-sm py-1 px-3 inline-flex items-center"
            >
              View on IMDB
              <FaExternalLinkAlt className="ml-2 text-xs" />
            </a>
          )}
          {item.type === 'book' && (
            <a
              href={`https://www.goodreads.com/search?q=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red text-sm py-1 px-3 inline-flex items-center"
            >
              View on Goodreads
              <FaExternalLinkAlt className="ml-2 text-xs" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}