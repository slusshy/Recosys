import httpx
import asyncio
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

async def fetch_books_from_google_api(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch books from Google Books API based on query.

    Args:
        query: Search query (e.g., "python programming", "sci-fi")
        max_results: Maximum number of results to return

    Returns:
        List of book dictionaries with standardized fields
    """
    try:
        # Clean query for API
        clean_query = query.replace("books", "").replace("book", "").strip()

        # If query is too generic, add some popular terms
        if len(clean_query.split()) < 2:
            clean_query += " programming" if "programming" in query.lower() else " fiction"

        url = f"https://www.googleapis.com/books/v1/volumes?q={clean_query}&maxResults={max_results}&orderBy=relevance"

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        books = []
        if "items" in data:
            for item in data["items"]:
                volume_info = item.get("volumeInfo", {})

                # Extract required fields
                title = volume_info.get("title", "Unknown Title")
                authors = volume_info.get("authors", [])
                authors_str = ", ".join(authors) if authors else "Unknown Author"

                description = volume_info.get("description", "")
                # Shorten description to ~2 lines (approx 200 chars)
                if len(description) > 200:
                    description = description[:200] + "..."

                average_rating = volume_info.get("averageRating")
                rating_str = f"{average_rating}/5" if average_rating else "Not rated yet"

                # Get thumbnail
                image_links = volume_info.get("imageLinks", {})
                thumbnail = image_links.get("thumbnail", "No image available")

                book = {
                    "id": item.get("id", f"book_{len(books)}"),
                    "title": title,
                    "authors": authors_str,
                    "description": description,
                    "averageRating": rating_str,
                    "thumbnail": thumbnail,
                    "type": "book"
                }
                books.append(book)

        logger.info(f"Successfully fetched {len(books)} books from Google Books API")
        return books

    except Exception as e:
        logger.error(f"Error fetching books from Google Books API: {e}")
        return []

def get_fallback_books(query: str) -> List[Dict[str, Any]]:
    """
    Get fallback book recommendations from sample data.
    """
    from ..data.recommendations import books

    # Filter by query keywords if possible
    query_lower = query.lower()
    filtered_books = []

    for book in books:
        # Check if any word in query matches book title, author, or genre
        searchable = f"{book['title']} {book['author']} {book['genre']}".lower()
        if any(word in searchable for word in query_lower.split()):
            filtered_books.append({
                "id": f"fallback_book_{len(filtered_books)}",
                "title": book["title"],
                "authors": book["author"],
                "description": f"Book by {book['author']}: {book['title']} ({book['genre']}).",
                "averageRating": f"{book['rating']}/5",
                "thumbnail": f"https://placehold.co/400x600?text={book['title'].replace(' ', '+')}",
                "type": "book"
            })

    # If no matches, return all books
    if not filtered_books:
        filtered_books = [{
            "id": f"fallback_book_{i}",
            "title": book["title"],
            "authors": book["author"],
            "description": f"Book by {book['author']}: {book['title']} ({book['genre']}).",
            "averageRating": f"{book['rating']}/5",
            "thumbnail": f"https://placehold.co/400x600?text={book['title'].replace(' ', '+')}",
            "type": "book"
        } for i, book in enumerate(books)]

    return filtered_books[:5]

async def get_book_recommendations(query: str) -> List[Dict[str, Any]]:
    """
    Get book recommendations, trying API first, then fallback to sample data.
    """
    # Try API first
    books = await fetch_books_from_google_api(query)

    # If API fails or returns empty, use fallback
    if not books:
        logger.info("Using fallback book data")
        books = get_fallback_books(query)

    return books
