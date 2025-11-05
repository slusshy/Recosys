import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    console.log('Contact form submission:', form);
    setTimeout(() => setSent(false), 2500);
  };

  const Input = ({ label, ...props }) => (
    <div>
      <label className="block text-sm mb-1 text-gray-300">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(108,99,255,0.18),transparent_60%)]" />
        <div className="container-max relative py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold">Get in Touch With Us</h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">Have a question, feedback, or collaboration idea? We’d love to hear from you.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Form (glass) */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            {sent && (
              <div className="mb-4 rounded-lg border border-green-400/40 bg-emerald-500/10 text-emerald-300 px-4 py-3">
                Message sent successfully!
              </div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <Input name="name" label="Full Name" placeholder="Enter your full name" value={form.name} onChange={update} />
              <Input name="email" type="email" label="Email Address" placeholder="Enter your email address" value={form.email} onChange={update} />
              <Input name="subject" label="Subject" placeholder="How can we help you?" value={form.subject} onChange={update} />
              <div>
                <label className="block text-sm mb-1 text-gray-300">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={update}
                  className="w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent transition"
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#A18CFF] text-white font-medium px-6 py-3 shadow-lg hover:scale-[1.01] transition-all duration-300">Send Message</button>
            </form>
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 shadow-[0_0_20px_rgba(108,99,255,0.25)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1114.5 9 2.5 2.5 0 0112 11.5z"/></svg>
                  </span>
                  <div>
                    <p className="font-medium text-white">Dehradun</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 shadow-[0_0_20px_rgba(108,99,255,0.25)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v.4l-10 6.25L2 6.4V6zm0 2.8V18a2 2 0 002 2h16a2 2 0 002-2V8.8l-10 6.25L2 8.8z"/></svg>
                  </span>
                  <div>
                    <p className="font-medium text-white">support@aipoweredrecommendation.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 shadow-[0_0_20px_rgba(108,99,255,0.25)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.23 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.4a1 1 0 011 1 11.4 11.4 0 00.6 3.6 1 1 0 01-.23 1.1L6.6 10.8z"/></svg>
                  </span>
                  <div>
                    <p className="font-medium text-white">+91 98765 43210</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold">Meet Our Team</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Anmol Gautam', role: 'Lead Developer', img: '/images/4.jpg' },
              { name: 'Simran Ara Khatun', role: 'AI Engineer', img: '/images/1.jpg' },
              { name: 'Chakshu Kamboj', role: 'UI/UX Designer', img: '/images/2.jpg' },
              { name: 'Tanmay Tripathi', role: 'Data Scientist', img: '/images/3.jpg' }
            ].map((member) => (
              <div key={member.name} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg hover:shadow-indigo-500/20 transition">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mx-auto object-cover" />
                <h3 className="mt-3 font-semibold">{member.name}</h3>
                <p className="text-indigo-300 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
