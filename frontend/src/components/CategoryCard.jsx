import React from 'react';

export default function CategoryCard({ title, desc, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card group text-left hover:shadow-red-glow-strong transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent/60"
    >
      <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shadow-red-glow mb-4">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="muted mt-1 text-sm">{desc}</p>
    </button>
  );
}
