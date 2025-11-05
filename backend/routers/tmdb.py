from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import httpx
from pydantic import BaseModel
from utils.cache import tmdb_cache
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter(prefix="/tmdb", tags=["tmdb"])

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Log API key status on startup (without exposing the actual key)
if TMDB_API_KEY:
    if TMDB_API_KEY == "your_tmdb_api_key_here":
        logger.warning("⚠️  TMDB_API_KEY is set to placeholder value. Please update backend/.env with your actual API key.")
    else:
        logger.info(f"✅ TMDB_API_KEY loaded successfully (length: {len(TMDB_API_KEY)} characters)")
else:
    logger.error("❌ TMDB_API_KEY not found in environment variables!")


class MovieResponse(BaseModel):
    id: int
    title: str
    description: str
    image: Optional[str]
    rating: float
    release_date: Optional[str]
    genre_ids: List[int]


class MovieDetailResponse(BaseModel):
    id: int
    title: str
    description: str
    image: Optional[str]
    backdrop: Optional[str]
    rating: float
    release_date: Optional[str]
    runtime: Optional[int]
    genres: List[Dict[str, Any]]
    tagline: Optional[str]
    status: Optional[str]
    budget: Optional[int]
    revenue: Optional[int]


def format_movie(movie: Dict[str, Any]) -> Dict[str, Any]:
    """Format TMDB movie data to match frontend expectations."""
    return {
        "id": movie.get("id"),
        "title": movie.get("title", ""),
        "description": movie.get("overview", "No description available"),
        "image": f"{TMDB_IMAGE_BASE_URL}{movie.get('poster_path')}" if movie.get("poster_path") else None,
        "rating": round(movie.get("vote_average", 0), 1),
        "release_date": movie.get("release_date", ""),
        "genre_ids": movie.get("genre_ids", [])
    }


def format_movie_detail(movie: Dict[str, Any]) -> Dict[str, Any]:
    """Format detailed TMDB movie data."""
    return {
        "id": movie.get("id"),
        "title": movie.get("title", ""),
        "description": movie.get("overview", "No description available"),
        "image": f"{TMDB_IMAGE_BASE_URL}{movie.get('poster_path')}" if movie.get("poster_path") else None,
        "backdrop": f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path')}" if movie.get("backdrop_path") else None,
        "rating": round(movie.get("vote_average", 0), 1),
        "release_date": movie.get("release_date", ""),
        "runtime": movie.get("runtime"),
        "genres": movie.get("genres", []),
        "tagline": movie.get("tagline", ""),
        "status": movie.get("status", ""),
        "budget": movie.get("budget", 0),
        "revenue": movie.get("revenue", 0)
    }


@router.get("/trending")
async def get_trending_movies() -> Dict[str, Any]:
    """
    Get trending movies from TMDB (weekly).
    Returns a list of trending movies with basic information.
    Cached for 10 minutes.
    """
    logger.info("📡 Trending movies endpoint called")

    # Check API key
    if not TMDB_API_KEY or TMDB_API_KEY == "your_tmdb_api_key_here":
        logger.error("❌ TMDB API key not configured or is placeholder value")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "TMDB API key not configured",
                "message": "Please add your TMDB API key to backend/.env file",
                "instructions": "Get your API key from https://www.themoviedb.org/settings/api",
                "current_value": "placeholder" if TMDB_API_KEY == "your_tmdb_api_key_here" else "missing"
            }
        )

    # Check cache first
    cache_key = "trending:weekly"
    cached_data = tmdb_cache.get(cache_key)
    if cached_data is not None:
        logger.info("✅ Returning cached trending movies")
        return {**cached_data, "cached": True}

    # Build request URL
    url = f"{TMDB_BASE_URL}/trending/movie/week"
    params = {"api_key": TMDB_API_KEY}

    # Log request (without exposing API key)
    logger.info(f"🌐 Fetching from TMDB: {url}")
    logger.info(f"📝 Request params: api_key=***{TMDB_API_KEY[-4:] if len(TMDB_API_KEY) > 4 else '****'}")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)

            # Log response status
            logger.info(f"📊 TMDB Response Status: {response.status_code}")

            response.raise_for_status()
            data = response.json()

            logger.info(f"✅ Successfully fetched {len(data.get('results', []))} trending movies")

            movies = [format_movie(movie) for movie in data.get("results", [])]

            result = {
                "results": movies,
                "total_results": len(movies),
                "page": data.get("page", 1),
                "cached": False
            }

            # Cache the result
            tmdb_cache.set(cache_key, result)
            logger.info(f"💾 Cached trending movies with key: {cache_key}")

            return result

    except httpx.HTTPStatusError as e:
        logger.error(f"❌ TMDB API HTTP Error: {e.response.status_code} - {e.response.text}")
        error_detail = {
            "error": "TMDB API error",
            "status_code": e.response.status_code,
            "message": str(e),
            "response": e.response.text[:200] if e.response.text else "No response body"
        }
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)

    except httpx.TimeoutException as e:
        logger.error(f"⏱️ TMDB API Timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail={"error": "Request timeout", "message": "TMDB API took too long to respond"}
        )

    except Exception as e:
        logger.error(f"❌ Unexpected error fetching trending movies: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Internal server error", "message": f"Error fetching trending movies: {str(e)}"}
        )


@router.get("/search")
async def search_movies(q: str = Query(..., min_length=1, description="Search query")) -> Dict[str, Any]:
    """
    Search for movies on TMDB.
    Returns a list of movies matching the search query.
    Cached for 10 minutes per unique query.
    """
    logger.info(f"🔍 Search endpoint called with query: '{q}'")

    # Check API key
    if not TMDB_API_KEY or TMDB_API_KEY == "your_tmdb_api_key_here":
        logger.error("❌ TMDB API key not configured or is placeholder value")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "TMDB API key not configured",
                "message": "Please add your TMDB API key to backend/.env file",
                "instructions": "Get your API key from https://www.themoviedb.org/settings/api",
                "current_value": "placeholder" if TMDB_API_KEY == "your_tmdb_api_key_here" else "missing"
            }
        )

    # Check cache first
    cache_key = f"search:{q.lower()}"
    cached_data = tmdb_cache.get(cache_key)
    if cached_data is not None:
        logger.info(f"✅ Returning cached search results for: '{q}'")
        return {**cached_data, "cached": True}

    # Build request URL
    url = f"{TMDB_BASE_URL}/search/movie"
    params = {
        "api_key": TMDB_API_KEY,
        "query": q,
        "include_adult": False
    }

    # Log request (without exposing API key)
    logger.info(f"🌐 Searching TMDB: {url}")
    logger.info(f"📝 Search query: '{q}', include_adult: False")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)

            # Log response status
            logger.info(f"📊 TMDB Response Status: {response.status_code}")

            response.raise_for_status()
            data = response.json()

            logger.info(f"✅ Found {data.get('total_results', 0)} total results for '{q}' (showing {len(data.get('results', []))})")

            movies = [format_movie(movie) for movie in data.get("results", [])]

            result = {
                "results": movies,
                "total_results": data.get("total_results", 0),
                "page": data.get("page", 1),
                "query": q,
                "cached": False
            }

            # Cache the result
            tmdb_cache.set(cache_key, result)
            logger.info(f"💾 Cached search results with key: {cache_key}")

            return result

    except httpx.HTTPStatusError as e:
        logger.error(f"❌ TMDB API HTTP Error: {e.response.status_code} - {e.response.text}")
        error_detail = {
            "error": "TMDB API error",
            "status_code": e.response.status_code,
            "message": str(e),
            "response": e.response.text[:200] if e.response.text else "No response body"
        }
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)

    except httpx.TimeoutException as e:
        logger.error(f"⏱️ TMDB API Timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail={"error": "Request timeout", "message": "TMDB API took too long to respond"}
        )

    except Exception as e:
        logger.error(f"❌ Unexpected error searching movies: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Internal server error", "message": f"Error searching movies: {str(e)}"}
        )


@router.get("/movie/{movie_id}")
async def get_movie_details(movie_id: int) -> Dict[str, Any]:
    """
    Get detailed information about a specific movie.
    Returns full movie details including genres, runtime, budget, etc.
    """
    logger.info(f"🎬 Movie details endpoint called for ID: {movie_id}")

    # Check API key
    if not TMDB_API_KEY or TMDB_API_KEY == "your_tmdb_api_key_here":
        logger.error("❌ TMDB API key not configured or is placeholder value")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "TMDB API key not configured",
                "message": "Please add your TMDB API key to backend/.env file",
                "instructions": "Get your API key from https://www.themoviedb.org/settings/api"
            }
        )

    # Build request URL
    url = f"{TMDB_BASE_URL}/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}

    logger.info(f"🌐 Fetching movie details from TMDB: {url}")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)

            logger.info(f"📊 TMDB Response Status: {response.status_code}")

            response.raise_for_status()
            movie = response.json()

            logger.info(f"✅ Successfully fetched details for: {movie.get('title', 'Unknown')}")

            return format_movie_detail(movie)

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            logger.warning(f"⚠️ Movie not found: ID {movie_id}")
            raise HTTPException(
                status_code=404,
                detail={"error": "Movie not found", "message": f"Movie with ID {movie_id} not found"}
            )
        logger.error(f"❌ TMDB API HTTP Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail={"error": "TMDB API error", "message": str(e)}
        )

    except httpx.TimeoutException as e:
        logger.error(f"⏱️ TMDB API Timeout: {str(e)}")
        raise HTTPException(
            status_code=504,
            detail={"error": "Request timeout", "message": "TMDB API took too long to respond"}
        )

    except Exception as e:
        logger.error(f"❌ Unexpected error fetching movie details: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Internal server error", "message": f"Error fetching movie details: {str(e)}"}
        )


@router.get("/popular")
async def get_popular_movies(page: int = Query(1, ge=1, le=500)) -> Dict[str, Any]:
    """
    Get popular movies from TMDB.
    Returns a list of currently popular movies.
    """
    if not TMDB_API_KEY or TMDB_API_KEY == "your_tmdb_api_key_here":
        raise HTTPException(
            status_code=500,
            detail="TMDB API key not configured. Please add TMDB_API_KEY to your .env file"
        )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/popular",
                params={
                    "api_key": TMDB_API_KEY,
                    "page": page
                }
            )
            response.raise_for_status()
            data = response.json()

            movies = [format_movie(movie) for movie in data.get("results", [])]

            return {
                "results": movies,
                "total_results": data.get("total_results", 0),
                "page": data.get("page", 1),
                "total_pages": data.get("total_pages", 1)
            }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"TMDB API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching popular movies: {str(e)}")


@router.get("/health")
async def tmdb_health_check() -> Dict[str, Any]:
    """
    Check TMDB API configuration and connectivity.
    Returns status of API key and connection.
    """
    logger.info("🏥 TMDB health check called")

    # Check API key configuration
    if not TMDB_API_KEY:
        return {
            "status": "error",
            "api_key_configured": False,
            "api_key_valid": False,
            "message": "TMDB_API_KEY not found in environment variables",
            "instructions": "Add TMDB_API_KEY to backend/.env file"
        }

    if TMDB_API_KEY == "your_tmdb_api_key_here":
        return {
            "status": "error",
            "api_key_configured": True,
            "api_key_valid": False,
            "message": "TMDB_API_KEY is set to placeholder value",
            "instructions": "Replace 'your_tmdb_api_key_here' with your actual TMDB API key in backend/.env"
        }

    # Test API key by making a simple request
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/configuration",
                params={"api_key": TMDB_API_KEY}
            )
            response.raise_for_status()

            logger.info("✅ TMDB API key is valid and working")
            return {
                "status": "ok",
                "api_key_configured": True,
                "api_key_valid": True,
                "api_key_length": len(TMDB_API_KEY),
                "message": "TMDB API is configured correctly and responding",
                "base_url": TMDB_BASE_URL
            }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 401:
            logger.error("❌ TMDB API key is invalid (401 Unauthorized)")
            return {
                "status": "error",
                "api_key_configured": True,
                "api_key_valid": False,
                "message": "TMDB API key is invalid (401 Unauthorized)",
                "instructions": "Check your API key at https://www.themoviedb.org/settings/api"
            }
        logger.error(f"❌ TMDB API error: {e.response.status_code}")
        return {
            "status": "error",
            "api_key_configured": True,
            "api_key_valid": False,
            "message": f"TMDB API error: {e.response.status_code}",
            "details": str(e)
        }
    except Exception as e:
        logger.error(f"❌ Error testing TMDB API: {str(e)}")
        return {
            "status": "error",
            "api_key_configured": True,
            "api_key_valid": False,
            "message": f"Error testing TMDB API: {str(e)}"
        }


@router.get("/cache/stats")
async def get_cache_stats() -> Dict[str, Any]:
    """
    Get cache statistics.
    Returns information about cached entries.
    """
    stats = tmdb_cache.get_stats()
    return {
        "cache_stats": stats,
        "ttl_minutes": 10,
        "message": "Cache automatically expires after 10 minutes"
    }


@router.post("/cache/clear")
async def clear_cache() -> Dict[str, Any]:
    """
    Clear all cached data.
    Use this to force fresh data from TMDB API.
    """
    tmdb_cache.clear()
    return {
        "message": "Cache cleared successfully",
        "status": "ok"
    }

