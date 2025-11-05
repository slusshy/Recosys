import React from 'react';

export default function RecommendationCard({ item, onView }) {
  return (
    <div className="card overflow-hidden hover:shadow-red-glow-strong transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight">{item.title}</h3>
          <div className="flex items-center gap-1 shrink-0 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < item.rating ? 'currentColor' : 'rgba(229,9,20,0.3)'}
                className="w-4 h-4"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
        <p className="muted text-sm mt-1">{item.description}</p>
        <button onClick={() => onView(item)} className="btn-red mt-4 w-full">View More</button>
      </div>
    </div>
  );
}
