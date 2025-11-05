import React from 'react';

const FEATURES = [
  {
    title: 'AI-Powered',
    desc: 'Advanced machine learning algorithms.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z"/>
      </svg>
    )
  },
  {
    title: 'Personalized',
    desc: 'Tailored to your unique preferences.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z"/>
      </svg>
    )
  },
  {
    title: 'Real-time',
    desc: 'Instant recommendations as you browse.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13 2H6a2 2 0 00-2 2v16l6-3 6 3V9"/>
      </svg>
    )
  }
];

export default function Features() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-max text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Powered by <span className="text-accent">Advanced AI</span>
        </h2>
        <p className="mt-2 muted max-w-2xl mx-auto">
          Our recommendation engine learns from your preferences to deliver increasingly accurate suggestions over time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="card text-left">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="muted mt-1 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
