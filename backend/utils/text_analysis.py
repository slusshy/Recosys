from typing import Tuple, Optional, Dict, List
import re

# Category keywords for matching
CATEGORY_KEYWORDS = {
    "movies": ["movie", "film", "cinema", "watch"],
    "books": ["book", "novel", "read", "literature", "author"],
    "products": ["product", "buy", "shop", "purchase", "item"],
    "blogs": ["blog", "article", "post", "read"]
}

# Genre keywords for matching
GENRE_KEYWORDS = {
    "action": ["action", "adventure", "thriller"],
    "romance": ["romance", "romantic", "love story"],
    "sci-fi": ["sci-fi", "science fiction", "scifi", "futuristic"],
    "horror": ["horror", "scary", "thriller", "supernatural"],
    "comedy": ["comedy", "funny", "humorous", "comedic"],
    "drama": ["drama", "dramatic", "serious"],
    "mystery": ["mystery", "detective", "crime", "suspense"],
    "fantasy": ["fantasy", "magical", "mythical"],
    "documentary": ["documentary", "real", "true story"],
    "biography": ["biography", "bio", "life story", "memoir"]
}

# TMDB genre IDs mapping
TMDB_GENRE_IDS = {
    "action": 28,
    "romance": 10749,
    "sci-fi": 878,
    "horror": 27,
    "comedy": 35,
    "drama": 18,
    "mystery": 9648,
    "fantasy": 14,
    "documentary": 99
}

def detect_category_and_genre(query: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Analyze a query string to detect the content category and genre.
    Returns a tuple of (category, genre).
    """
    query = query.lower()
    
    # Detect category
    category = None
    max_matches = 0
    
    for cat, keywords in CATEGORY_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in query)
        if matches > max_matches:
            max_matches = matches
            category = cat
    
    # Detect genre
    genre = None
    max_matches = 0
    
    for gen, keywords in GENRE_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in query)
        if matches > max_matches:
            max_matches = matches
            genre = gen
            
    return category, genre

def extract_search_terms(query: str, exclude_words: List[str] = None) -> str:
    """
    Extract meaningful search terms from the query by removing category and genre keywords.
    """
    if exclude_words is None:
        exclude_words = []
    
    # Combine all keywords to exclude
    words_to_exclude = set()
    for keywords in CATEGORY_KEYWORDS.values():
        words_to_exclude.update(keywords)
    for keywords in GENRE_KEYWORDS.values():
        words_to_exclude.update(keywords)
    words_to_exclude.update(exclude_words)
    
    # Split query into words and filter out excluded terms
    query_words = query.lower().split()
    search_terms = [word for word in query_words if word not in words_to_exclude]
    
    return " ".join(search_terms) if search_terms else query

def get_tmdb_genre_id(genre: str) -> Optional[int]:
    """Get the TMDB genre ID for a given genre name."""
    return TMDB_GENRE_IDS.get(genre)