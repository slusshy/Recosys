import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard.jsx';

const CATEGORY_DATA = [
  {
    key: 'Movies',
    desc: 'Discover films tailored to your taste',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 5h2l2 3h2l-2-3h2l2 3h2l-2-3h2l2 3h2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
      </svg>
    ),
    genres: ['Romantic','Sci-Fi','Action','Horror','Mystery','Drama'],
  },
  {
    key: 'Books',
    desc: 'Find your next great read',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3 5a2 2 0 012-2h12a2 2 0 012 2v14a1 1 0 01-1.447.894L14 18.118l-5.553 1.776A1 1 0 017 18.999V5H5v14H4a1 1 0 01-1-1V5z"/>
      </svg>
    ),
    genres: ['Fiction','Thriller','Biography','History','Poetry','Self-Help'],
  },
  {
    key: 'Comics',
    desc: 'Explore graphic novels and comics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 4h16v14H8l-4 4V4z"/>
      </svg>
    ),
    genres: ['Superhero','Manga','Fantasy','Adventure','Comedy','Sci-Fi'],
  },
  {
    key: 'Blogs',
    desc: 'Read articles that interest you',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 5h16v2H4V5zm0 4h10v2H4V9zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>
      </svg>
    ),
    genres: ['Tech','Lifestyle','Health','AI','Cybersecurity','Motivation'],
  },
  {
    key: 'Products',
    desc: 'Shop items picked just for you',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M6 2l3 3h6l3-3h2v20H4V2h2z"/>
      </svg>
    ),
    genres: ['Gadgets','Fashion','Home Decor','Books & Stationery','Fitness','Accessories'],
  },
];

export default function CategoriesPage() {
  const [active, setActive] = useState(null); // key of selected category

  const handleCategoryClick = (key) => {
    setActive((prev) => (prev === key ? null : key));
  };

  const handleGenreClick = (category, genre) => {
    console.log('Selected genre:', { category, genre });
  };

  const slug = (s) => String(s).toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        <div className="container-max relative py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold">Explore <span className="text-accent">Categories</span></h1>
          <p className="mt-3 text-gray-300">Choose what you love — we’ll personalize your experience.</p>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-8">
        <div className="container-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {CATEGORY_DATA.map((c) => (
              <Link key={c.key} to={`/category/${c.key.toLowerCase()}`} className="block">
                <CategoryCard
                  title={c.key}
                  desc={c.desc}
                  icon={c.icon}
                  onClick={() => handleCategoryClick(c.key)}
                />
              </Link>
            ))}
          </div>

          {/* Active genres panel */}
          {active && (
            <div className="mt-8 card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-semibold">
                  {active} <span className="text-accent">Genres</span>
                </h3>
                <button className="text-sm text-gray-300 hover:text-white" onClick={() => setActive(null)}>Close</button>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CATEGORY_DATA.find((c) => c.key === active)?.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/categories/${slug(active)}/${slug(g)}`}
                    onClick={() => handleGenreClick(active, g)}
                    className="btn-red w-full py-2 text-sm text-center"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container-max text-center">
          <p className="muted mb-4">Ready to discover your next favorite? Start exploring now.</p>
          <button className="btn-red px-6 py-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
