import React, { useState } from 'react';

export default function Hero() {
  const [query, setQuery] = useState('');
  const onSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', query);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
      <div className="container-max py-16 sm:py-24 relative">
        <div className="mx-auto text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            <span className="text-accent">AI</span> <span className="text-white">RecoSys</span>
          </h1>
          <p className="mt-4 text-gray-300">
            Discover smart recommendations powered by advanced AI.
          </p>
          <form onSubmit={onSearch} className="mt-8 flex items-center bg-[#121212] border border-red-900/30 rounded-full p-1.5 shadow-red-glow w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, books, products, and more…"
              className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-400 px-4 py-3 focus:outline-none"
            />
            <button type="submit" className="btn-red rounded-full px-5 py-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 2a8 8 0 105.293 14.293l4.207 4.207a1 1 0 101.414-1.414l-4.207-4.207A8 8 0 0010 2zm-6 8a6 6 0 1110.392 4.02 1 1 0 00-.206.206A6 6 0 014 10z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
