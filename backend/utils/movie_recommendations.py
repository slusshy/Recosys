from typing import List, Dict, Optional, Any
import csv
from pathlib import Path

def load_movies() -> List[Dict[str, Any]]:
    """Load movies from CSV file without pandas."""
    rows: List[Dict[str, Any]] = []
    try:
        # Try local path first, then repo root fallback
        csv_path = Path(__file__).parent.parent / 'movies.csv'
        if not csv_path.exists():
            csv_path = Path(__file__).parent.parent.parent / 'movies.csv'
        if not csv_path.exists():
            return []
        with csv_path.open(newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                # Normalize keys we expect
                rows.append({
                    'title': r.get('title', '').strip(),
                    'genre': r.get('genre', '').strip(),
                    'description': r.get('description', '').strip(),
                })
    except Exception as e:
        print(f"Error loading movies.csv: {str(e)}")
    return rows

def get_movie_recommendations(query: str, genre: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get movie recommendations based on query and genre."""
    movies = load_movies()

    # Filter by genre (case-insensitive)
    if genre:
        filtered = [m for m in movies if m.get('genre', '').lower() == genre.lower()]
    else:
        filtered = movies

    if not filtered:
        return []

    # Placeholder relevance filtering by query (simple contains on title/description)
    q = (query or '').lower().strip()
    if q:
        filtered = [m for m in filtered if q in m.get('title', '').lower() or q in m.get('description', '').lower()]

    # Add placeholder image/link expected by frontend
    recommendations: List[Dict[str, Any]] = []
    for m in filtered:
        title = m.get('title', '')
        recommendations.append({
            **m,
            'image': f"https://api.lorem.space/image/movie?w=500&h=750&hash={hash(title)}",
            'link': f"/movies/{title.lower().replace(' ', '-')}"
        })

    return recommendations