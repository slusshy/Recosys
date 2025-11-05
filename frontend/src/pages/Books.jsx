import React, { useState } from 'react';

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock book data
  const books = [
    {
      id: 1,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      description: 'A dazzling novel about all the choices that go into a life well lived',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=700&fit=crop',
      rating: 4.5,
      genre: 'Fiction',
      year: 2020
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An easy and proven way to build good habits and break bad ones',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=700&fit=crop',
      rating: 4.8,
      genre: 'Self-Help',
      year: 2018
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=700&fit=crop',
      rating: 4.7,
      genre: 'Sci-Fi',
      year: 2021
    },
    {
      id: 4,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      description: 'A woman\'s act of violence against her husband and the therapist obsessed with uncovering her motive',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=700&fit=crop',
      rating: 4.4,
      genre: 'Thriller',
      year: 2019
    },
    {
      id: 5,
      title: 'Educated',
      author: 'Tara Westover',
      description: 'A memoir about a young woman who leaves her survivalist family and goes on to earn a PhD',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop',
      rating: 4.6,
      genre: 'Biography',
      year: 2018
    },
    {
      id: 6,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      description: 'A murder mystery set in the marshlands of North Carolina',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=700&fit=crop',
      rating: 4.5,
      genre: 'Mystery',
      year: 2018
    },
    {
      id: 7,
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      description: 'Aging Hollywood icon Evelyn Hugo finally tells the truth about her glamorous and scandalous life',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=700&fit=crop',
      rating: 4.7,
      genre: 'Historical Fiction',
      year: 2017
    },
    {
      id: 8,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      description: 'A brief history of humankind from the Stone Age to the modern age',
      image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&h=700&fit=crop',
      rating: 4.6,
      genre: 'History',
      year: 2011
    }
  ];

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-900/20 to-transparent">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.15),transparent_60%)]" />
        <div className="container-max py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-accent">Books</span> <span className="text-white">Recommendations</span>
            </h1>
            <p className="mt-4 text-gray-300">
              Find your next great read with AI-powered recommendations
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
                placeholder="Search books by title, author, or genre..."
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

      {/* Books Grid */}
      <section className="py-8 pb-16">
        <div className="container-max">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No books found matching "{searchQuery}"</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-300">
                  Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="card group cursor-pointer hover:shadow-red-glow-strong transition-all">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                        {book.genre}
                      </div>
                    </div>
                    <h3 className="font-semibold text-base mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{book.author}</p>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{book.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-xs">{book.year}</span>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-300">{book.rating}</span>
                      </div>
                    </div>
                    <button className="btn-red w-full text-sm py-2">
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

