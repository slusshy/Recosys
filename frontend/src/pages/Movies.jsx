import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import MovieDetails from '../components/MovieDetails';
import api from '../api/axios';
import { Toaster, toast } from 'react-hot-toast';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Fetch trending movies on initial load
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/tmdb/trending');
      setMovies(response.data.results || []);
      setSearchQuery('');
    } catch (err) {
      console.error('Error fetching trending movies:', err);
      setError('Failed to load trending movies. Please check your TMDB API key.');
      toast.error('Failed to load trending movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      // If search is cleared, show trending movies
      fetchTrendingMovies();
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const response = await api.get('/tmdb/search', {
        params: { q: query }
      });
      
      setMovies(response.data.results || []);
      
      if (response.data.results.length === 0) {
        toast('No movies found for your search', { icon: '🔍' });
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again.');
      toast.error('Failed to search movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovieId(movie.id);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Toaster position="top-right" />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        
        <div className="container-max relative">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              <span className="text-accent">Discover</span>{' '}
              <span className="text-white">Movies</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {searchQuery 
                ? `Search results for "${searchQuery}"`
                : 'Explore trending movies powered by TMDB'
              }
            </p>
          </motion.div>

          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="Search for movies by title, genre, or keyword..."
          />
        </div>
      </section>

      {/* Movies Grid Section */}
      <section className="py-8 sm:py-12">
        <div className="container-max">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? 'Search Results' : 'Trending This Week'}
            </h2>
            
            {!searchQuery && !isLoading && movies.length > 0 && (
              <button
                onClick={fetchTrendingMovies}
                className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            )}
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <motion.div
              className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchTrendingMovies}
                className="mt-4 btn-red"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Movies Grid */}
          {!error && (
            <MovieGrid
              movies={movies}
              onMovieClick={handleMovieClick}
              isLoading={isLoading}
            />
          )}

          {/* Results Count */}
          {!isLoading && !error && movies.length > 0 && (
            <motion.div
              className="mt-8 text-center text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
            </motion.div>
          )}
        </div>
      </section>

      {/* Movie Details Modal */}
      <MovieDetails
        movieId={selectedMovieId}
        onClose={handleCloseDetails}
      />
    </div>
  );
}

