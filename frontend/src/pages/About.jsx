import React from 'react';

const steps = [
  {
    title: 'Step 1 – Data Collection',
    desc: 'Our AI collects user preferences and historical choices.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v3H3V5zm0 5h18v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm4 6h10v2H7v-2z" />
      </svg>
    )
  },
  {
    title: 'Step 2 – Model Training',
    desc: 'Using machine learning, we analyze similarities and generate embeddings.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
      </svg>
    )
  },
  {
    title: 'Step 3 – Smart Suggestions',
    desc: 'Our recommender delivers results in real-time based on your context.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    )
  }
];

const tech = [
  { name: 'Python', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="w-6 h-6">
        <path d="M24 4c6 0 10 2 10 8v6H14c-6 0-8-4-8-10S12 4 24 4zM24 44c-6 0-10-2-10-8v-6h20c6 0 8 4 8 10s-6 4-18 4z"/>
      </svg>
    ) },
  { name: 'FastAPI', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2zm1 5l4 7h-3v5l-4-7h3z"/>
      </svg>
    ) },
  { name: 'React', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 10a2 2 0 102 2 2 2 0 00-2-2zm0-8C6 2 2 6 2 12s4 10 10 10 10-4 10-10S18 2 12 2z"/>
      </svg>
    ) },
  { name: 'TailwindCSS', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3 12c2-6 6-6 8-4s4 2 6-2c-2 6-6 6-8 4s-4-2-6 2zm0 6c2-6 6-6 8-4s4 2 6-2c-2 6-6 6-8 4s-4-2-6 2z"/>
      </svg>
    ) },
  { name: 'Machine Learning', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a5 5 0 015 5v2h2a3 3 0 013 3v2a3 3 0 01-3 3h-2v2a5 5 0 11-10 0v-2H5a3 3 0 01-3-3v-2a3 3 0 013-3h2V7a5 5 0 015-5z"/>
      </svg>
    ) }
];

const team = [
  {
    name: 'Anmol Gautam',
    role: 'Lead Developer',
    img: '/images/4.jpg'
  },
  {
    name: 'Simran Ara Khatun',
    role: 'AI Engineer',
    img: '/images/1.jpg'
  },
  {
    name: 'Chakshu Kamboj',
    role: 'UI/UX Designer',
    img: '/images/2.jpg'
  },
  {
    name: 'Tanmay Tripathi',
    role: 'Data Scientist',
    img: '/images/3.jpg'
  },
];

export default function About() {
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        <div className="container-max relative py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            About <span className="text-accent">AI RecoSys</span>
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            Discover how our intelligent recommendation system works under the hood.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container-max py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">
              AI RecoSys is a smart recommendation platform built with cutting-edge AI. It helps users discover movies, books, comics, and blogs tailored to their interests using advanced machine learning models.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-red-900/30 shadow-red-glow flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="w-24 h-24 text-accent">
                <path d="M24 4a8 8 0 00-8 8v6H8a4 4 0 00-4 4v4a4 4 0 004 4h8v6a8 8 0 0016 0v-6h8a4 4 0 004-4v-4a4 4 0 00-4-4h-8v-6a8 8 0 00-8-8z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-center">How It Works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="card">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 shadow-red-glow">
                  {s.icon}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="muted mt-1 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-10">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold">Powered by Modern Technologies</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {tech.map((t) => (
              <div key={t.name} className="card group flex items-center gap-3 justify-center py-4 hover:shadow-red-glow-strong">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  {t.icon}
                </div>
                <span className="font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold">Meet the Team</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="card hover:shadow-red-glow-strong transition-all">
                <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full object-cover mx-auto shadow-red-glow" />
                <h3 className="mt-4 font-semibold">{m.name}</h3>
                <p className="text-accent text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="container-max text-center">
          <button onClick={backToTop} className="btn-red px-6 py-3">
            Back to Home
          </button>
        </div>
      </section>

    </div>
  );
}
