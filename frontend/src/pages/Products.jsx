import React, { useState } from 'react';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock product data
  const products = [
    {
      id: 1,
      title: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      price: '$299.99',
      rating: 4.5,
      category: 'Electronics'
    },
    {
      id: 2,
      title: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor and GPS',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      price: '$399.99',
      rating: 4.7,
      category: 'Electronics'
    },
    {
      id: 3,
      title: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for better posture',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
      price: '$49.99',
      rating: 4.3,
      category: 'Accessories'
    },
    {
      id: 4,
      title: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
      price: '$129.99',
      rating: 4.6,
      category: 'Electronics'
    },
    {
      id: 5,
      title: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness and color temperature',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
      price: '$39.99',
      rating: 4.4,
      category: 'Home Decor'
    },
    {
      id: 6,
      title: 'Backpack',
      description: 'Water-resistant laptop backpack with USB charging port',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      price: '$59.99',
      rating: 4.5,
      category: 'Accessories'
    },
    {
      id: 7,
      title: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop',
      price: '$89.99',
      rating: 4.2,
      category: 'Home & Kitchen'
    },
    {
      id: 8,
      title: 'Yoga Mat',
      description: 'Non-slip eco-friendly yoga mat with carrying strap',
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
      price: '$29.99',
      rating: 4.6,
      category: 'Fitness'
    }
  ];

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-900/20 to-transparent">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        <div className="container-max py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-accent">Products</span> <span className="text-white">Recommendations</span>
            </h1>
            <p className="mt-4 text-gray-300">
              Discover amazing products curated just for you
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8">
        <div className="container-max">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-4 bg-[#111] border border-red-900/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 pb-16">
        <div className="container-max">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products found matching "{searchQuery}"</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-300">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="card group cursor-pointer hover:shadow-red-glow-strong transition-all">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.category}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold text-xl">{product.price}</span>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-300">{product.rating}</span>
                      </div>
                    </div>
                    <button className="btn-red w-full mt-4">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

