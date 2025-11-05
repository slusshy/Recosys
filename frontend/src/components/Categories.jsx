import React from 'react';

const CATS = [
  {
    key: 'Movies',
    desc: 'Discover films tailored to your taste',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 5h2l2 3h2l-2-3h2l2 3h2l-2-3h2l2 3h2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
      </svg>
    )
  },
  {
    key: 'Books',
    desc: 'Find your next great read',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3 5a2 2 0 012-2h12a2 2 0 012 2v14a1 1 0 01-1.447.894L14 18.118l-5.553 1.776A1 1 0 017 18.999V5H5v14H4a1 1 0 01-1-1V5z"/>
      </svg>
    )
  },
  {
    key: 'Comics',
    desc: 'Explore graphic novels and comic',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 4h16v14H8l-4 4V4z"/>
      </svg>
    )
  },
  {
    key: 'Blogs',
    desc: 'Read articles that interest you',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 5h16v2H4V5zm0 4h10v2H4V9zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>
      </svg>
    )
  },
  {
    key: 'Products',
    desc: 'Shop items picked just for you',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M6 2l3 3h6l3-3h2v20H4V2h2z"/>
      </svg>
    )
  },
];

export default function Categories() {
  const clickCategory = (name) => {
    console.log('Selected category:', name);
  };

  return (
    <section id="categories" className="py-12 sm:py-16">
      <div className="container-max">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Explore <span className="text-accent">Categories</span>
          </h2>
          <p className="mt-2 muted">
            Choose a category to get personalized AI-powered recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATS.map((c) => (
            <div key={c.key} className="card group">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shadow-red-glow mb-4">
                {c.icon}
              </div>
              <h3 className="font-semibold">{c.key}</h3>
              <p className="muted mt-1 text-sm">{c.desc}</p>
              <button
                onClick={() => clickCategory(c.key)}
                className="btn-red mt-5 w-full"
              >
                Get Recommendations
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
