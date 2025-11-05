import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiHeart, FiSun, FiMoon } from 'react-icons/fi';
import { getFavoritesCount } from '../utils/favorites';

export default function Navbar({ onNavigate }) {
  const [favCount, setFavCount] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');

    // Update favorites count
    updateFavCount();

    // Listen for storage changes (favorites updates)
    const handleStorageChange = () => {
      updateFavCount();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('favoritesChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleStorageChange);
    };
  }, []);

  const updateFavCount = () => {
    setFavCount(getFavoritesCount());
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const links = [
    { name: 'Home', href: '/', key: 'home' },
    { name: 'Movies', href: '/movies', key: 'movies' },
    { name: 'Products', href: '/products', key: 'products' },
    { name: 'Books', href: '/books', key: 'books' },
    { name: 'About', href: '/about', key: 'about' },
  ];

  return (
    <header className="">
      <div className="container-max flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-wide">
          <span className="text-accent">AI</span>
          <span className="text-white">RecoSys</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.name}
              to={l.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(l.key);
                }
              }}
              className={({ isActive }) =>
                `relative transition-colors ${isActive ? 'text-accent' : 'text-gray-200 hover:text-white'}`
              }
            >
              {l.name}
              <span className="absolute -bottom-2 left-0 h-0.5 bg-accent transition-all duration-300" style={{ width: '100%', opacity: 0.2 }} />
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Favorites Link */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `relative p-2 rounded-lg transition-all ${
                isActive
                  ? 'text-accent bg-accent/10'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`
            }
            title="Favorites"
          >
            <div className="relative">
              <FiHeart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              )}
            </div>
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/5 transition-all"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          <button className="sm:hidden btn-red px-3 py-1">Menu</button>
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </header>
  );
}
