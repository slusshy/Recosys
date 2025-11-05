import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function CategoryDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError('');
      try {
        const username = 'gaurav';
        const res = await api.get(`/recommendations/${name}?username=${username}`);
        setData(res.data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }
    if (name) fetchRecommendations();
  }, [name]);

  if (loading) return <p className="text-center text-gray-400 py-16">Loading recommendations...</p>;
  if (error) return <p className="text-center text-red-400 py-16">{error}</p>;

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col items-center py-10">
      <div className="w-full max-w-6xl px-4 flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg px-3 py-2 border border-white/15 text-gray-200 hover:text-white hover:shadow-red-glow transition-all"
        >
          ← Back
        </button>
        <Link to="/categories" className="text-sm text-accent hover:underline">All Categories</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 capitalize">{name} Recommendations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full max-w-6xl">
        {data.map((item, i) => (
          <div key={i} className="card hover:shadow-red-glow-strong transform transition-all duration-300 hover:-translate-y-0.5">
            <h2 className="text-xl font-semibold mb-2">{item.title || item.name}</h2>
            <p className="text-gray-400 text-sm mb-2">
              {item.genre || item.category || (item.tags && item.tags.join(', '))}
            </p>
            {item.rating && <p className="text-yellow-400">⭐ {item.rating}</p>}
            {item.year && <p className="text-gray-400 text-sm">Year: {item.year}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
