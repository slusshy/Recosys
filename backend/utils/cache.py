"""
Simple in-memory cache for TMDB API responses
Caches data for 10 minutes to reduce API calls
"""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import json

class SimpleCache:
    """In-memory cache with expiration"""
    
    def __init__(self, default_ttl_minutes: int = 10):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = timedelta(minutes=default_ttl_minutes)
    
    def _generate_key(self, prefix: str, params: Dict[str, Any]) -> str:
        """Generate a cache key from prefix and parameters"""
        # Sort params for consistent keys
        sorted_params = sorted(params.items())
        params_str = json.dumps(sorted_params, sort_keys=True)
        return f"{prefix}:{params_str}"
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache if it exists and hasn't expired
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found/expired
        """
        if key not in self._cache:
            return None
        
        entry = self._cache[key]
        
        # Check if expired
        if datetime.now() > entry['expires_at']:
            # Remove expired entry
            del self._cache[key]
            return None
        
        return entry['value']
    
    def set(self, key: str, value: Any, ttl: Optional[timedelta] = None) -> None:
        """
        Set value in cache with expiration
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live (defaults to default_ttl)
        """
        if ttl is None:
            ttl = self.default_ttl
        
        self._cache[key] = {
            'value': value,
            'expires_at': datetime.now() + ttl,
            'created_at': datetime.now()
        }
    
    def delete(self, key: str) -> bool:
        """
        Delete a key from cache
        
        Args:
            key: Cache key
            
        Returns:
            True if key was deleted, False if not found
        """
        if key in self._cache:
            del self._cache[key]
            return True
        return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired entries
        
        Returns:
            Number of entries removed
        """
        now = datetime.now()
        expired_keys = [
            key for key, entry in self._cache.items()
            if now > entry['expires_at']
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        now = datetime.now()
        active_entries = sum(
            1 for entry in self._cache.values()
            if now <= entry['expires_at']
        )
        
        return {
            'total_entries': len(self._cache),
            'active_entries': active_entries,
            'expired_entries': len(self._cache) - active_entries
        }


# Global cache instance
tmdb_cache = SimpleCache(default_ttl_minutes=10)

