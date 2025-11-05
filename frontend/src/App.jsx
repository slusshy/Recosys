import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import About from './pages/About.jsx';
import Category from './pages/Category.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import RecommendationResults from './pages/RecommendationResults.jsx';
import Contact from './pages/Contact.jsx';
import Movies from './pages/Movies.jsx';
import Products from './pages/Products.jsx';
import Books from './pages/Books.jsx';
import Favorites from './pages/Favorites.jsx';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/products" element={<Products />} />
            <Route path="/books" element={<Books />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/categories/:type" element={<CategoryDetail />} />
            <Route path="/category/:name" element={<CategoryDetail />} />
            <Route path="/categories/:category/:genre" element={<CategoryDetail />} />
            <Route path="/recommendations/:category/:genre" element={<RecommendationResults />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
