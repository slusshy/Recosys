import React from 'react';

export default function RecommendationResults({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-[2/3] bg-[#222] rounded-lg mb-4" />
            <div className="h-6 bg-[#222] rounded w-3/4 mb-3" />
            <div className="h-4 bg-[#222] rounded w-1/2 mb-2" />
            <div className="h-4 bg-[#222] rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!results?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {results.map((item) => (
        <div key={item.id} className="card group">
          <div className="aspect-[2/3] overflow-hidden rounded-lg mb-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <div className="text-sm text-accent mb-2">{item.genre}</div>
          <p className="text-sm text-gray-400 line-clamp-3">{item.description}</p>
        </div>
      ))}
    </div>
  );
}