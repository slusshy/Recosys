import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';
import api from '../api/axios.js';

const MOCK = {
  movies: {
    romantic: [
      { id: 'before-sunrise', title: 'Before Sunrise', description: 'Two strangers connect overnight in Vienna.', rating: 4, image: 'https://images.unsplash.com/photo-1515165562835-c3b8c4f1a3c6?q=80&w=1200&auto=format&fit=crop' },
      { id: 'la-la-land', title: 'La La Land', description: 'Love and dreams in Los Angeles.', rating: 5, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop' },
      { id: 'the-notebook', title: 'The Notebook', description: 'A timeless romantic tale.', rating: 4, image: 'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?q=80&w=1200&auto=format&fit=crop' },
    ],
    'sci-fi': [
      { id: 'interstellar', title: 'Interstellar', description: 'A journey through space and time.', rating: 5, image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop' },
      { id: 'inception', title: 'Inception', description: 'Dream within a dream thriller.', rating: 5, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop' },
      { id: 'blade-runner-2049', title: 'Blade Runner 2049', description: 'Neo-noir sci-fi masterpiece.', rating: 4, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop' },
      { id: 'arrival', title: 'Arrival', description: 'A linguist communicates with aliens.', rating: 4, image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  books: {
    thriller: [
      { id: 'gone-girl', title: 'Gone Girl', description: 'A psychological thriller full of twists.', rating: 4, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
      { id: 'the-girl-with-the-dragon-tattoo', title: 'The Girl with the Dragon Tattoo', description: 'Dark mystery and suspense.', rating: 4, image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  blogs: {
    tech: [
      { id: 'ai-trends', title: 'Top 10 AI Trends', description: 'Where AI is heading next.', rating: 4, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
      { id: 'edge-computing', title: 'Edge Computing Explained', description: 'Why edge matters for latency.', rating: 4, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  products: {
    electronics: [
      { id: 'smartwatch', title: 'Smartwatch Pro X', description: 'Track health and stay connected.', rating: 4, image: 'https://images.unsplash.com/photo-1518441902113-c1d3b2f1f4f1?q=80&w=1200&auto=format&fit=crop' },
      { id: 'headphones', title: 'Noise-Cancelling Headphones', description: 'Immersive sound with deep bass.', rating: 5, image: 'https://images.unsplash.com/photo-1518443895914-6f7f1d7d5b63?q=80&w=1200&auto=format&fit=crop' },
      { id: 'camera', title: 'Mirrorless Camera Z', description: 'Crisp photos, pro features.', rating: 4, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
};

export default function RecommendationResults() {
  const { category = 'movies', genre = 'sci-fi' } = useParams();
  const [filter, setFilter] = useState('popular');
  const [sort, setSort] = useState('rating');
  const [modalItem, setModalItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({
    results: [],
    summary: '',
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const query = `recommend me some ${genre} ${category}`;
        const response = await api.post('/recommendations', { query });
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category, genre]);

  const items = useMemo(() => {
    let out = [...recommendations.results];
    if (filter === 'newest') out = [...out].reverse();
    if (sort === 'alphabetical') out.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'rating') out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return out;
  }, [recommendations.results, filter, sort]);

  const titleCase = (s) => s?.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(108,99,255,0.18),transparent_60%)]" />
        <div className="container-max relative py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Top AI-Powered Recommendations for {titleCase(genre)} {titleCase(category)}
          </h1>
          <p className="mt-3 text-gray-300">Curated by AI to match your preferences and trends.</p>
          {!loading && items.length > 0 && recommendations.summary && (
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-red-900/20 via-red-900/30 to-red-900/20 p-6 rounded-xl backdrop-blur-sm border border-red-900/30">
                <p className="text-lg text-gray-100 italic leading-relaxed">
                  "{recommendations.summary}"
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-4">
        <div className="container-max flex flex-wrap items-center gap-3 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Filter:</span>
            {['popular','newest'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg border border-red-900/30 text-sm ${filter===f? 'bg-accent text-white shadow-red-glow' : 'bg-[#111] text-gray-200 hover:shadow-red-glow'} transition-all`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Sort:</span>
            {['rating','alphabetical'].map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-lg border border-red-900/30 text-sm ${sort===s? 'bg-accent text-white shadow-red-glow' : 'bg-[#111] text-gray-200 hover:shadow-red-glow'} transition-all`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-6">
        <div className="container-max">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <RecommendationCard key={item.id} item={item} onView={setModalItem} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No results available for this combination.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 text-center">
        <div className="container-max">
          <p className="muted mb-4">Want more personalized picks? Our AI refines results as you explore.</p>
          <Link to="/categories" className="btn-red inline-block px-6 py-3">Back to Categories</Link>
        </div>
      </section>

      <Footer />

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card max-w-2xl w-[90%] relative">
            <button onClick={() => setModalItem(null)} className="absolute -top-3 -right-3 bg-accent text-white w-8 h-8 rounded-full shadow-red-glow">✕</button>
            <div className="overflow-hidden rounded-xl">
              <img src={modalItem.image} alt={modalItem.title} className="w-full h-56 object-cover" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{modalItem.title}</h3>
            <p className="muted mt-1">{titleCase(genre)} • {titleCase(category)}</p>
            <p className="muted mt-3">{modalItem.description}</p>
            <div className="mt-4 flex gap-3">
              <button className="btn-red">Add to Favorites</button>
              <button className="px-4 py-2 rounded-lg border border-red-900/30 hover:shadow-red-glow transition-all" onClick={() => setModalItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
