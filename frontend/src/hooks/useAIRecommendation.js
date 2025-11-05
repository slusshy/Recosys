import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from 'react-use';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

// API configurations
const BACKEND_API_URL = 'http://127.0.0.1:8000';

// Types of recommendations we support
const RECOMMENDATION_TYPES = {
  MOVIES: 'movies',
  BOOKS: 'books',
  MUSIC: 'music',
  PRODUCTS: 'products',
};

// Dummy data for fallback
const FALLBACK_DATA = {
  movies: [
    { id: 1, title: "Inception", genre: "Sci-Fi", rating: 8.8, image: "https://picsum.photos/300/450", description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
    // ... more movies
  ],
  books: [
    { id: 1, title: "Dune", genre: "Sci-Fi", rating: 4.5, image: "https://picsum.photos/300/450", description: "A noble family becomes embroiled in a war for control over the galaxys most valuable asset." },
    // ... more books
  ],
  // ... other categories
};

export function useAIRecommendation() {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const abortController = useRef(null);
  
  // User preferences in localStorage
  const [userPreferences, setUserPreferences] = useLocalStorage('ai_recommendations_prefs', {
    name: '',
    favoriteGenres: [],
    lastQuery: '',
    lastVisit: null,
  });



  // Clean up old chat history (keep last 10 messages)
  const pruneHistory = useCallback(() => {
    setChatHistory(prev => prev.slice(-10));
  }, []);

  // Classify the type of recommendation needed
  const classifyQuery = (query) => {
    const q = query.toLowerCase();
    if (q.includes('movie') || q.includes('film') || q.includes('watch')) return RECOMMENDATION_TYPES.MOVIES;
    if (q.includes('book') || q.includes('read')) return RECOMMENDATION_TYPES.BOOKS;
    if (q.includes('music') || q.includes('song') || q.includes('listen')) return RECOMMENDATION_TYPES.MUSIC;
    return RECOMMENDATION_TYPES.PRODUCTS;
  };

  // Fetch recommendations from backend API
  const fetchBackendRecommendations = async (query, userName = null) => {
    try {
      const response = await axios.post(`${BACKEND_API_URL}/api/recommendations/`, {
        query: query,
        user_name: userName
      });

      return {
        response: response.data.message || "Here are your recommendations!",
        recommendations: response.data.results || [],
        follow_up: response.data.follow_up
      };
    } catch (error) {
      console.error('Backend API Error:', error);
      return null;
    }
  };



  // Main function to get recommendations
  const getRecommendations = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user query to chat history
      const timestamp = format(new Date(), 'HH:mm');
      setChatHistory(prev => [...prev, {
        role: 'user',
        content: query,
        timestamp,
      }]);

      // Fetch from backend
      const backendResult = await fetchBackendRecommendations(query, userPreferences.name);

      if (backendResult) {
        // Process backend response
        const { response, recommendations: recs, follow_up } = backendResult;

        // Extract recommendations from the response
        let extractedRecs = [];
        if (recs && Array.isArray(recs)) {
          extractedRecs = recs.map(item => ({
            id: item.id || item.title?.toLowerCase().replace(/\s+/g, '-') || Math.random(),
            title: item.title || 'Unknown',
            description: item.description || '',
            image: item.image || `https://picsum.photos/300/450?random=${Math.random()}`,
            genre: item.genre || item.category || 'Unknown',
            rating: item.rating || 0,
            type: item.type || 'unknown'
          }));
        }

        setRecommendations(extractedRecs);

        // Add AI response to chat history
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: response,
          timestamp: format(new Date(), 'HH:mm'),
          recommendations: extractedRecs,
          follow_up: follow_up
        }]);
      } else {
        // Fallback to dummy data
        const type = classifyQuery(query);
        setRecommendations(FALLBACK_DATA[type] || []);
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: `Sorry, I'm having trouble connecting right now. Here are some ${type} recommendations from my memory.`,
          timestamp: format(new Date(), 'HH:mm'),
          recommendations: FALLBACK_DATA[type] || []
        }]);
      }

      // Update user preferences
      setUserPreferences(prev => ({
        ...prev,
        lastQuery: query,
        lastVisit: new Date().toISOString(),
      }));

      pruneHistory();
    } catch (err) {
      setError(err.message);
      const type = classifyQuery(query);
      setRecommendations(FALLBACK_DATA[type] || []);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = useCallback(() => {
    setChatHistory([]);
    setRecommendations([]);
    setStreamingResponse('');
  }, []);



  // Update user profile
  const updateUserProfile = useCallback((name) => {
    setUserPreferences(prev => ({
      ...prev,
      name: DOMPurify.sanitize(name),
    }));
  }, [setUserPreferences]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }

    };
  }, [isSpeaking]);

  return {
    isLoading,
    error,
    chatHistory,
    recommendations,
    streamingResponse,
    userPreferences,
    getRecommendations,
    clearChat,
    updateUserProfile,
  };
}