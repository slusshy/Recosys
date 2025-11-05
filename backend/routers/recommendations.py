import logging
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Union
from data.database import RECOMMENDATIONS
from utils.jwt_handler import require_token
from utils.recommendation_engine import get_recommendations
from data import recommendations as rec
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# Constants
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
MAX_RESULTS = 10
REQUEST_TIMEOUT = 30.0

# Filler words to remove from queries (excluding genre terms)
FILLER_WORDS = {
    'show', 'me', 'some', 'recommend', 'movies', 'movie', 'films', 'film', 'want', 'like', 'suggest',
    'please', 'can', 'you', 'find', 'get', 'give', 'tell', 'about', 'a', 'an', 'the', 'good', 'best',
    'top', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent', 'perfect', 'nice',
    'cool', 'interesting', 'fun', 'exciting', 'thrilling', 'action', 'packed', 'full', 'of', 'with',
    'that', 'are', 'is', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'let', 'lets',
    'let\'s', 'i', 'we', 'they', 'he', 'she', 'it', 'this', 'that', 'these', 'those', 'my', 'your',
    'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    'all', 'any', 'both', 'each', 'few', 'many', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'even', 'ever',
    'never', 'here', 'there', 'now', 'then', 'once', 'always', 'sometimes', 'often', 'usually',
    'rarely', 'seldom', 'again', 'still', 'yet', 'already', 'soon', 'later', 'before', 'after',
    'since', 'until', 'while', 'during', 'through', 'across', 'against', 'among', 'between',
    'into', 'onto', 'upon', 'under', 'over', 'above', 'below', 'behind', 'beside', 'near', 'by',
    'from', 'to', 'at', 'in', 'on', 'for', 'as', 'with', 'about', 'like', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'among', 'inside', 'outside', 'beside',
    'behind', 'beyond', 'near', 'far', 'close', 'open', 'full', 'empty', 'hot', 'cold', 'wet',
    'dry', 'big', 'small', 'large', 'little', 'long', 'short', 'high', 'low', 'wide', 'narrow',
    'thick', 'thin', 'heavy', 'light', 'hard', 'soft', 'fast', 'slow', 'easy', 'difficult',
    'simple', 'complex', 'new', 'old', 'young', 'fresh', 'clean', 'dirty', 'right', 'wrong',
    'true', 'false', 'real', 'fake', 'good', 'bad', 'better', 'best', 'worse', 'worst', 'more',
    'most', 'less', 'least', 'first', 'last', 'next', 'previous', 'early', 'late', 'soon',
    'later', 'now', 'then', 'here', 'there', 'everywhere', 'nowhere', 'anywhere', 'somewhere',
    'every', 'all', 'both', 'neither', 'either', 'none', 'any', 'some', 'many', 'much', 'few',
    'little', 'several', 'enough', 'plenty', 'lot', 'lots', 'bit', 'piece', 'part', 'whole',
    'half', 'quarter', 'third', 'everything', 'nothing', 'anything', 'something', 'everyone',
    'noone', 'anyone', 'someone', 'everybody', 'nobody', 'anybody', 'somebody', 'everything',
    'nothing', 'anything', 'something', 'everywhere', 'nowhere', 'anywhere', 'somewhere'
}

# Genre terms to preserve (not remove as filler)
GENRE_TERMS = {
    'sci-fi', 'science', 'fiction', 'horror', 'thriller', 'comedy', 'drama', 'action', 'adventure',
    'romance', 'mystery', 'fantasy', 'animation', 'documentary', 'biography', 'crime', 'western',
    'musical', 'war', 'history', 'family', 'sport', 'music', 'reality', 'talk', 'news', 'game'
}

# Content type keywords
CONTENT_TYPE_KEYWORDS = {
    "books": ["book", "books", "read", "reading", "novel", "author", "literature"],
    "products": ["product", "products", "buy", "shop", "gadget", "item", "purchase"],
    "blogs": ["blog", "blogs", "article", "post", "tech", "lifestyle", "news"]
}

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


class QueryPayload(BaseModel):
    query: str


def normalize_query(query: str) -> str:
    """Normalize query by lowercasing, replacing hyphens/underscores with spaces, and collapsing whitespace."""
    if not query:
        return ""
    normalized = query.lower().replace("-", " ").replace("_", " ")
    return " ".join(normalized.split())


def detect_content_type(normalized_query: str) -> str:
    """Detect content type from normalized query."""
    # Check for specific content type keywords
    for content_type, keywords in CONTENT_TYPE_KEYWORDS.items():
        if any(keyword in normalized_query for keyword in keywords):
            return content_type

    # Check for genre terms that might indicate books/movies
    if any(genre in normalized_query for genre in ['thriller', 'mystery', 'romance', 'fantasy', 'biography']):
        return "books"  # Default to books for these genres

    return "movies"  # default


def remove_filler_words(query: str) -> str:
    """Remove filler words from query, preserving genre terms and content type keywords."""
    words = query.lower().split()
    filtered_words = [
        word for word in words
        if (word not in FILLER_WORDS or word in GENRE_TERMS) and len(word) > 1
    ]
    return " ".join(filtered_words) if filtered_words else ""


async def search_tmdb(search_term: str) -> List[Dict[str, Any]]:
    """Search TMDB API for movies."""
    if not TMDB_API_KEY:
        logger.warning("TMDB API key not found, skipping TMDB search")
        return []

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/search/movie",
                params={
                    "api_key": TMDB_API_KEY,
                    "query": search_term,
                    "include_adult": False,
                    "page": 1
                }
            )
            response.raise_for_status()
            data = response.json()

            results = []
            for movie in data.get("results", [])[:MAX_RESULTS]:
                results.append({
                    "id": movie.get("id"),
                    "title": movie.get("title", ""),
                    "genre": "",  # TMDB search doesn't provide genres
                    "description": movie.get("overview", "No description available"),
                    "image": f"{TMDB_IMAGE_BASE_URL}{movie.get('poster_path')}" if movie.get("poster_path") else None,
                    "rating": round(movie.get("vote_average", 0), 1),
                    "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
                    "type": "movie"
                })
            logger.info(f"TMDB search successful: {len(results)} results for '{search_term}'")
            return results

    except Exception as e:
        logger.error(f"TMDB search failed for '{search_term}': {str(e)}")
        return []


def search_static(content_type: str, query: str) -> List[Dict[str, Any]]:
    """Search static data for given content type."""
    normalized_query = normalize_query(query)
    results = []

    if content_type == "movies":
        for i, movie in enumerate(rec.movies):
            title = movie.get("title", "")
            genre = movie.get("genre", "")
            title_norm = normalize_query(title)
            genre_norm = normalize_query(genre)

            should_include = (
                not normalized_query or
                normalized_query in title_norm or
                normalized_query in genre_norm
            )

            if should_include:
                results.append({
                    "id": i + 1,
                    "title": title,
                    "genre": genre,
                    "description": f"{title} is a highly rated {genre} movie.",
                    "image": f"https://placehold.co/400x600?text={title.replace(' ', '+')}",
                    "rating": movie.get("rating", 0),
                    "year": movie.get("year", ""),
                    "type": "movie"
                })

    elif content_type == "books":
        # If query is content-type specific or empty, return all books
        if not normalized_query or normalized_query.lower() in ["books", "book"]:
            for i, book in enumerate(rec.books):
                title = book.get("title", "")
                genre = book.get("genre", "")
                author = book.get("author", "")
                results.append({
                    "id": 1000 + i + 1,
                    "title": title,
                    "genre": genre,
                    "description": f"Book by {author}: {title} ({genre}).",
                    "image": f"https://placehold.co/400x600?text={title.replace(' ', '+')}",
                    "rating": book.get("rating", 0),
                    "author": author,
                    "type": "book"
                })
        else:
            for i, book in enumerate(rec.books):
                title = book.get("title", "")
                genre = book.get("genre", "")
                author = book.get("author", "")
                title_norm = normalize_query(title)
                genre_norm = normalize_query(genre)
                author_norm = normalize_query(author)

                should_include = (
                    any(word in title_norm for word in normalized_query.split()) or
                    any(word in genre_norm for word in normalized_query.split()) or
                    any(word in author_norm for word in normalized_query.split())
                )

                if should_include:
                    results.append({
                        "id": 1000 + i + 1,
                        "title": title,
                        "genre": genre,
                        "description": f"Book by {author}: {title} ({genre}).",
                        "image": f"https://placehold.co/400x600?text={title.replace(' ', '+')}",
                        "rating": book.get("rating", 0),
                        "author": author,
                        "type": "book"
                    })

    elif content_type == "products":
        for i, product in enumerate(rec.products):
            name = product.get("name", "")
            category = product.get("category", "")
            name_norm = normalize_query(name)
            category_norm = normalize_query(category)

            # For products, if no specific query, return all; otherwise filter
            should_include = (
                not normalized_query or
                normalized_query in name_norm or
                normalized_query in category_norm
            )

            if should_include:
                results.append({
                    "id": 2000 + i + 1,
                    "title": name,
                    "genre": category,
                    "description": f"Product: {name} ({category}).",
                    "image": f"https://placehold.co/400x600?text={name.replace(' ', '+')}",
                    "price": product.get("price", 0),
                    "type": "product"
                })

    elif content_type == "blogs":
        for i, blog in enumerate(rec.blogs):
            title = blog.get("title", "")
            topic = blog.get("topic", "")
            title_norm = normalize_query(title)
            topic_norm = normalize_query(topic)

            # For blogs, if no specific query, return all; otherwise filter
            should_include = (
                not normalized_query or
                normalized_query in title_norm or
                normalized_query in topic_norm
            )

            if should_include:
                results.append({
                    "id": 3000 + i + 1,
                    "title": title,
                    "genre": topic,
                    "description": f"Blog post: {title} ({topic}).",
                    "image": f"https://placehold.co/400x600?text={title.replace(' ', '+')}",
                    "tags": blog.get("tags", []),
                    "type": "blog"
                })

    logger.info(f"Static search for {content_type}: {len(results)} results for '{query}'")
    return results


@router.get("/")
def get_all() -> List[Dict[str, Any]]:
    return RECOMMENDATIONS


@router.get("/by-id/{item_id}")
def get_by_id(item_id: int) -> Dict[str, Any]:
    for item in RECOMMENDATIONS:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Recommendation not found")


@router.post("/")
async def search_recommendations(payload: Union[QueryPayload, str]) -> Dict[str, Any]:
    """
    Accepts a free-form query and returns a list of normalized recommendation items
    expected by the frontend RecommendationResults component.
    """
    # Support both {"query": "..."} and raw string body
    raw_query = payload if isinstance(payload, str) else getattr(payload, "query", "")
    logger.info(f"Processing recommendation query: '{raw_query}'")

    normalized_query = normalize_query(raw_query)
    content_type = detect_content_type(normalized_query)
    logger.info(f"Detected content type: {content_type}")

    results: List[Dict[str, Any]] = []

    if content_type == "movies":
        # Try TMDB first
        search_term = remove_filler_words(raw_query)
        logger.info(f"Searching TMDB with term: '{search_term}'")
        results = await search_tmdb(search_term)

        # Fallback to static data if TMDB failed or returned no results
        if not results:
            logger.info("TMDB search failed or returned no results, falling back to static data")
            effective_search = search_term if search_term else raw_query
            results = search_static("movies", effective_search)
    else:
        # For non-movie content types, use static data
        # Remove filler words to get meaningful search terms
        cleaned_query = remove_filler_words(raw_query)
        if not cleaned_query:
            # If only filler words remain, return all items
            results = search_static(content_type, "")
        else:
            results = search_static(content_type, cleaned_query)

    logger.info(f"Returning {len(results)} results for content type '{content_type}'")
    return {"results": results}


@router.get("/secure")
def secure_list(_: dict = require_token) -> List[Dict[str, Any]]:
    # Returns the same as public list, but requires a valid token
    return RECOMMENDATIONS


@router.get("/trending")
def trending() -> List[Dict[str, Any]]:
    # simple top by rating across categories where available
    all_items: List[Dict[str, Any]] = []
    for m in rec.movies:
        all_items.append({"type": "movie", **m})
    for b in rec.books:
        all_items.append({"type": "book", **b})
    # blogs/products may not have rating; give them baseline
    for bl in rec.blogs:
        all_items.append({"type": "blog", **bl, "rating": 3.5})
    for p in rec.products:
        all_items.append({"type": "product", **p, "rating": 4.0})
    all_items.sort(key=lambda x: x.get("rating", 0), reverse=True)
    return all_items[:10]


@router.get("/{category}")
def recommend_for_user(category: str, username: str) -> List[Dict[str, Any]]:
    if category.lower() not in {"movies", "books", "blogs", "products", "comics"}:
        raise HTTPException(status_code=400, detail="Unsupported category")
    items = get_recommendations(username=username, category=category)
    if not items:
        raise HTTPException(status_code=404, detail="No recommendations found for user/category")
    return items
