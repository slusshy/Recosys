/**
 * Favorites Management Utility
 * Handles localStorage operations for favorite movies
 */

const FAVORITES_KEY = 'tmdb_favorites';

/**
 * Dispatch custom event when favorites change
 */
const dispatchFavoritesChanged = () => {
  window.dispatchEvent(new Event('favoritesChanged'));
};

/**
 * Get all favorites from localStorage
 * @returns {Array} Array of favorite movie objects
 */
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

/**
 * Add a movie to favorites
 * @param {Object} movie - Movie object to add
 * @returns {boolean} Success status
 */
export const addFavorite = (movie) => {
  try {
    const favorites = getFavorites();
    
    // Check if already exists
    if (favorites.some(fav => fav.id === movie.id)) {
      return false;
    }
    
    // Add movie with timestamp
    const favoriteMovie = {
      ...movie,
      addedAt: new Date().toISOString()
    };
    
    favorites.push(favoriteMovie);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    dispatchFavoritesChanged();
    return true;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
};

/**
 * Remove a movie from favorites
 * @param {number} movieId - ID of movie to remove
 * @returns {boolean} Success status
 */
export const removeFavorite = (movieId) => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    dispatchFavoritesChanged();
    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
};

/**
 * Check if a movie is in favorites
 * @param {number} movieId - ID of movie to check
 * @returns {boolean} True if movie is favorited
 */
export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === movieId);
};

/**
 * Toggle favorite status of a movie
 * @param {Object} movie - Movie object
 * @returns {boolean} New favorite status (true if added, false if removed)
 */
export const toggleFavorite = (movie) => {
  if (isFavorite(movie.id)) {
    removeFavorite(movie.id);
    return false;
  } else {
    addFavorite(movie);
    return true;
  }
};

/**
 * Get count of favorites
 * @returns {number} Number of favorites
 */
export const getFavoritesCount = () => {
  return getFavorites().length;
};

/**
 * Clear all favorites
 * @returns {boolean} Success status
 */
export const clearAllFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    dispatchFavoritesChanged();
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
};

