import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiStar, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { getFavorites, removeFavorite, clearAllFavorites } from '../utils/favorites';
import { toast, Toaster } from 'react-hot-toast';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleRemove = (movieId, movieTitle) => {
    removeFavorite(movieId);
    setFavorites(favorites.filter(fav => fav.id !== movieId));
    toast.success(`Removed "${movieTitle}" from favorites`);
  };

  const handleClearAll = () => {
    clearAllFavorites();
    setFavorites([]);
    setShowClearConfirm(false);
    toast.success('All favorites cleared');
  };

  const FavoriteCard = ({ movie }) => {
    const { id, title, image, rating, release_date, description } = movie;

    return (
      <motion.div
        className="card overflow-hidden group"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        layout
      >
        <div className="flex gap-4">
          {/* Poster */}
          <div className="relative w-24 sm:w-32 flex-shrink-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/500x750/1a1a1a/e50914?text=${encodeURIComponent(title)}`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <span className="text-gray-500 text-xs text-center px-2">{title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-accent transition-colors">
                {title}
              </h3>
              
              <button
                onClick={() => handleRemove(id, title)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                aria-label="Remove from favorites"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 mt-2">
              {rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{rating}</span>
                </div>
              )}

              {release_date && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(release_date).getFullYear()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-gray-400 text-sm mt-3 line-clamp-2 sm:line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-[#0a0a0a] to-dark">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        
        <div className="container-max relative">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                <FiHeart className="inline-block w-10 h-10 text-accent fill-accent mr-3 mb-2" />
                <span className="text-white">My Favorites</span>
              </h1>
              <p className="text-gray-300 text-lg">
                {favorites.length === 0 
                  ? 'No favorites yet. Start adding movies you love!'
                  : `${favorites.length} ${favorites.length === 1 ? 'movie' : 'movies'} saved`
                }
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-8 sm:py-12">
        <div className="container-max">
          {favorites.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiHeart className="w-24 h-24 mx-auto text-gray-700 mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2">No Favorites Yet</h3>
              <p className="text-gray-400 mb-8">
                Start exploring movies and add your favorites by clicking the heart icon
              </p>
              <Link to="/movies" className="btn-red inline-flex items-center gap-2">
                Browse Movies
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {favorites.map((movie) => (
                <FavoriteCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            className="bg-[#111] rounded-2xl p-6 max-w-md w-full border border-red-900/30"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">Clear All Favorites?</h3>
            <p className="text-gray-400 mb-6">
              This will remove all {favorites.length} movies from your favorites. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

