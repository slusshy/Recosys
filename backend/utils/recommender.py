import os
from typing import List, Dict, Any, Optional
import httpx
import asyncio
from dotenv import load_dotenv
from .text_analysis import detect_category_and_genre, extract_search_terms, get_tmdb_genre_id

# Load environment variables
load_dotenv()

class RecommendationResult:
    def __init__(self, title: str, description: str, image: str, link: str):
        self.title = title
        self.description = description
        self.image = image
        self.link = link

    def to_dict(self) -> Dict[str, str]:
        return {
            "title": self.title,
            "description": self.description,
            "image": self.image,
            "link": self.link
        }

async def search_tmdb_movies(query: str, genre: Optional[str] = None) -> List[RecommendationResult]:
    """Search for movies using TMDB API."""
    api_key = os.getenv("TMDB_API_KEY")
    if not api_key:
        raise ValueError("TMDB_API_KEY not found in environment variables")

    base_url = "https://api.themoviedb.org/3"
    params = {
        "api_key": api_key,
        "query": query,
        "language": "en-US",
        "page": 1
    }

    if genre:
        genre_id = get_tmdb_genre_id(genre)
        if genre_id:
            params["with_genres"] = genre_id

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{base_url}/search/movie", params=params)
            response.raise_for_status()
            data = response.json()

            results = []
            for movie in data.get("results", [])[:5]:
                if movie.get("poster_path"):
                    results.append(RecommendationResult(
                        title=movie["title"],
                        description=movie["overview"],
                        image=f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
                        link=f"https://www.themoviedb.org/movie/{movie['id']}"
                    ))
            return results
    except Exception as e:
        print(f"TMDB API Error: {str(e)}")
        return []

async def search_google_books(query: str, genre: Optional[str] = None) -> List[RecommendationResult]:
    """Search for books using Google Books API."""
    search_query = f"{query} {genre}" if genre else query
    url = f"https://www.googleapis.com/books/v1/volumes"
    params = {"q": search_query, "maxResults": 5}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            results = []
            for book in data.get("items", []):
                volume_info = book["volumeInfo"]
                results.append(RecommendationResult(
                    title=volume_info.get("title", ""),
                    description=volume_info.get("description", "No description available")[:200] + "...",
                    image=volume_info.get("imageLinks", {}).get("thumbnail", ""),
                    link=volume_info.get("previewLink", "")
                ))
            return results
    except Exception as e:
        print(f"Google Books API Error: {str(e)}")
        return []

async def search_products(query: str, category: Optional[str] = None) -> List[RecommendationResult]:
    """Search for products using FakeStore API."""
    base_url = "https://fakestoreapi.com/products"
    url = f"{base_url}/category/{category}" if category else base_url

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            products = response.json()

            results = []
            for product in products[:5]:
                results.append(RecommendationResult(
                    title=product["title"],
                    description=product["description"],
                    image=product["image"],
                    link=f"https://fakestoreapi.com/products/{product['id']}"
                ))
            return results
    except Exception as e:
        print(f"FakeStore API Error: {str(e)}")
        return []

def get_blog_recommendations(query: str, genre: Optional[str] = None) -> List[RecommendationResult]:
    """Generate blog recommendations with placeholder data."""
    topics = [
        "technology", "productivity", "self-improvement",
        "programming", "design", "business", "startup"
    ]
    
    blogs = [
        {
            "title": f"The Complete Guide to {query.title()}",
            "description": f"Learn everything about {query} with practical tips and expert advice.",
            "image": f"https://picsum.photos/seed/{query}/400/300",
            "link": f"https://medium.com/search?q={query}"
        },
        {
            "title": f"10 Best Practices for {query.title()}",
            "description": f"Industry experts share their insights on {query} and how to excel in it.",
            "image": f"https://picsum.photos/seed/{query}2/400/300",
            "link": f"https://medium.com/search?q={query}"
        }
    ]

    return [RecommendationResult(**blog) for blog in blogs]

async def get_recommendations(query: str) -> Dict[str, Any]:
    """
    Main recommendation function that processes the query and returns recommendations.
    """
    try:
        # Detect category and genre from query
        category, genre = detect_category_and_genre(query)
        search_terms = extract_search_terms(query)

        # If no category detected, try multiple categories
        if not category:
            results = []
            tasks = [
                search_tmdb_movies(search_terms),
                search_google_books(search_terms)
            ]
            results_list = await asyncio.gather(*tasks)
            for category_results in results_list:
                results.extend(category_results)
            
            if results:
                return {
                    "results": [result.to_dict() for result in results],
                    "message": f"Here are some recommendations based on your query: '{query}'"
                }
            else:
                return {
                    "results": [],
                    "message": "No recommendations found. Try being more specific in your query."
                }

        # Get recommendations based on detected category
        results = []
        if category == "movies":
            results = await search_tmdb_movies(search_terms, genre)
        elif category == "books":
            results = await search_google_books(search_terms, genre)
        elif category == "products":
            results = await search_products(search_terms)
        elif category == "blogs":
            results = get_blog_recommendations(search_terms)

        # Handle empty results
        if not results:
            return {
                "results": [],
                "message": f"No {category} found matching your query. Try a different search term."
            }

        return {
            "results": [result.to_dict() for result in results],
            "category": category,
            "genre": genre if genre else "all"
        }

    except Exception as e:
        # Log the error (in a production environment)
        print(f"Error processing recommendation: {str(e)}")
        
        # Return a user-friendly error response
        return {
            "results": [],
            "message": "An error occurred while processing your request. Please try again later."
        }
