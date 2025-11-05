import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi';
import api from '../api/axios';

export default function MovieDetails({ movieId, onClose }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/tmdb/movie/${movieId}`);
        setMovie(response.data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <AnimatePresence>
      {movieId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0b0b0b] rounded-2xl shadow-2xl"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
                <p className="text-gray-400 text-center">{error}</p>
                <button onClick={onClose} className="mt-6 btn-red">
                  Close
                </button>
              </div>
            ) : movie ? (
              <>
                {/* Backdrop Image */}
                {movie.backdrop && (
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/50 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Poster */}
                    {movie.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-48 rounded-lg shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {movie.title}
                      </h1>

                      {movie.tagline && (
                        <p className="text-lg text-gray-400 italic mb-4">
                          "{movie.tagline}"
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        {movie.rating > 0 && (
                          <div className="flex items-center gap-2 bg-[#111] px-3 py-2 rounded-lg">
                            <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-white">{movie.rating}</span>
                            <span className="text-gray-400 text-sm">/10</span>
                          </div>
                        )}

                        {movie.release_date && (
                          <div className="flex items-center gap-2 bg-[#111] px-3 py-2 rounded-lg">
                            <FiCalendar className="w-5 h-5 text-accent" />
                            <span className="text-white">{new Date(movie.release_date).getFullYear()}</span>
                          </div>
                        )}

                        {movie.runtime && (
                          <div className="flex items-center gap-2 bg-[#111] px-3 py-2 rounded-lg">
                            <FiClock className="w-5 h-5 text-accent" />
                            <span className="text-white">{formatRuntime(movie.runtime)}</span>
                          </div>
                        )}

                        {movie.status && (
                          <div className="bg-[#111] px-3 py-2 rounded-lg">
                            <span className="text-white">{movie.status}</span>
                          </div>
                        )}
                      </div>

                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-400 mb-2">Genres</h3>
                          <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre) => (
                              <span
                                key={genre.id}
                                className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {movie.description && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-400 mb-2">Overview</h3>
                          <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                        </div>
                      )}

                      {/* Budget & Revenue */}
                      {(movie.budget > 0 || movie.revenue > 0) && (
                        <div className="grid grid-cols-2 gap-4">
                          {movie.budget > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                                <FiDollarSign className="w-4 h-4" />
                                Budget
                              </h3>
                              <p className="text-white font-semibold">{formatCurrency(movie.budget)}</p>
                            </div>
                          )}

                          {movie.revenue > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-gray-400 mb-1 flex items-center gap-1">
                                <FiDollarSign className="w-4 h-4" />
                                Revenue
                              </h3>
                              <p className="text-white font-semibold">{formatCurrency(movie.revenue)}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

