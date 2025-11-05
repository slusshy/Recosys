import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiCalendar } from 'react-icons/fi';
import FavoriteButton from './FavoriteButton';

const MovieCard = ({ movie, onClick }) => {
  const { title, image, rating, release_date, description } = movie;

  return (
    <motion.div
      className="card cursor-pointer overflow-hidden group"
      onClick={() => onClick(movie)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/500x750/1a1a1a/e50914?text=${encodeURIComponent(title)}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-gray-500 text-center px-4">{title}</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{rating}</span>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-2 left-2">
          <FavoriteButton movie={movie} />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-sm text-gray-200 line-clamp-3">{description || 'No description available'}</p>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-3">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        {release_date && (
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
            <FiCalendar className="w-3 h-3" />
            <span>{new Date(release_date).getFullYear()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function MovieGrid({ movies, onMovieClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-gray-800 rounded-lg" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
        <p className="text-gray-400">Try searching for something else</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie, index) => (
        <motion.div
          key={movie.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <MovieCard movie={movie} onClick={onMovieClick} />
        </motion.div>
      ))}
    </div>
  );
}

