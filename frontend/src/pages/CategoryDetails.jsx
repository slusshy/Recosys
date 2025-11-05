import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';

// Mock catalog by category/genre
const MOCK = {
  movies: {
    'sci-fi': [
      { id: 'interstellar', title: 'Interstellar', description: 'A journey through space and time.', rating: 5, image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop' },
      { id: 'inception', title: 'Inception', description: 'A mind-bending heist within dreams.', rating: 5, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop' },
      { id: 'blade-runner-2049', title: 'Blade Runner 2049', description: 'A visually stunning neo-noir sci-fi.', rating: 4, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop' },
    ],
    action: [
      { id: 'madmax', title: 'Mad Max: Fury Road', description: 'Relentless action in a post-apocalyptic world.', rating: 5, image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  books: {
    thriller: [
      { id: 'gone-girl', title: 'Gone Girl', description: 'A psychological thriller full of twists.', rating: 4, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
    ],
    fiction: [
      { id: 'the-alchemist', title: 'The Alchemist', description: 'A fable about following your dreams.', rating: 5, image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1200&auto=format&fit=crop' },
      { id: 'dune', title: 'Dune', description: 'Epic science fiction saga.', rating: 5, image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  blogs: {
    tech: [
      { id: 'ai-trends', title: 'Top 10 AI Trends', description: 'Where AI is heading next.', rating: 4, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' },
      { id: 'cyber-basics', title: 'Cybersecurity Basics', description: 'Stay safe in a digital world.', rating: 4, image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
  products: {
    gadgets: [
      { id: 'smartwatch', title: 'Smartwatch Pro X', description: 'Track health and stay connected.', rating: 4, image: 'https://images.unsplash.com/photo-1518441902113-c1d3b2f1f4f1?q=80&w=1200&auto=format&fit=crop' },
      { id: 'headphones', title: 'Noise-Cancelling Headphones', description: 'Immersive sound with deep bass.', rating: 5, image: 'https://images.unsplash.com/photo-1518443895914-6f7f1d7d5b63?q=80&w=1200&auto=format&fit=crop' },
    ],
  },
};

export default function CategoryDetails() {
  const { category = 'movies', genre = 'sci-fi' } = useParams();
  const [filter, setFilter] = useState('popular');
  const [sort, setSort] = useState('relevance');
  const [modalItem, setModalItem] = useState(null);

  const items = useMemo(() => {
    const c = String(category || '').toLowerCase();
    const g = String(genre || '').toLowerCase();
    const arr = MOCK[c]?.[g] || [];
    // placeholder transformations for filter/sort
    let out = [...arr];
    if (filter === 'newest') out = [...out].reverse();
    if (sort === 'alphabetical') out.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'rating') out.sort((a, b) => b.rating - a.rating);
    return out;
  }, [category, genre, filter, sort]);

  const titleCase = (s) => s?.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="bg-gradient-to-b from-black/80 to-red-900/10 border-b border-red-900/20 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/70">
        <Navbar />
      </div>

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        <div className="container-max relative py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Top Recommendations for {titleCase(genre)} {titleCase(category)}
          </h1>
          <p className="mt-3 text-gray-300">Curated by AI RecoSys — tailored just for you.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4">
        <div className="container-max flex flex-wrap items-center gap-3 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Filter:</span>
            {['popular','newest','top-rated'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg border border-red-900/30 text-sm ${filter===f? 'bg-accent text-white shadow-red-glow' : 'bg-[#111] text-gray-200 hover:shadow-red-glow'} transition-all`}>
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Sort:</span>
            {['relevance','alphabetical','rating'].map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-lg border border-red-900/30 text-sm ${sort===s? 'bg-accent text-white shadow-red-glow' : 'bg-[#111] text-gray-200 hover:shadow-red-glow'} transition-all`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-6">
        <div className="container-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <RecommendationCard key={it.id} item={it} onView={setModalItem} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-gray-400">No results available for this combination.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 text-center">
        <div className="container-max">
          <p className="muted mb-4">Didn’t find what you love? Let AI RecoSys learn from your preferences.</p>
          <Link to="/categories" className="btn-red inline-block px-6 py-3">Back to Categories</Link>
        </div>
      </section>

      <Footer />

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card max-w-2xl w-[90%] relative">
            <button
              onClick={() => setModalItem(null)}
              className="absolute -top-3 -right-3 bg-accent text-white w-8 h-8 rounded-full shadow-red-glow"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-xl">
              <img src={modalItem.image} alt={modalItem.title} className="w-full h-56 object-cover" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{modalItem.title}</h3>
            <p className="muted text-sm mt-1">{titleCase(genre)} • {titleCase(category)}</p>
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
