import httpx
import asyncio
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

async def fetch_products_from_fake_api(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch products from Fake Store API, filtering by category if mentioned.

    Args:
        query: Search query (e.g., "electronics", "men's clothing")
        max_results: Maximum number of results to return

    Returns:
        List of product dictionaries with standardized fields
    """
    try:
        # Determine category from query
        category = extract_category_from_query(query)

        if category:
            # Fetch specific category
            url = f"https://fakestoreapi.com/products/category/{category}"
        else:
            # Fetch all products
            url = "https://fakestoreapi.com/products"

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            products_data = response.json()

        # If we got all products but have a category, filter them
        if not category and query.strip():
            products_data = filter_products_by_query(products_data, query)

        # Convert to standardized format
        products = []
        for item in products_data[:max_results]:
            rating = item.get("rating", {})
            rating_value = rating.get("rate", 0)

            product = {
                "id": item.get("id", f"product_{len(products)}"),
                "title": item.get("title", "Unknown Product"),
                "price": f"${item.get('price', 0):.2f}",
                "description": item.get("description", "")[:150] + "..." if len(item.get("description", "")) > 150 else item.get("description", ""),
                "image": item.get("image", "No image available"),
                "rating": f"{rating_value}/5" if rating_value else "Not rated",
                "category": item.get("category", "general"),
                "type": "product"
            }
            products.append(product)

        logger.info(f"Successfully fetched {len(products)} products from Fake Store API")
        return products

    except Exception as e:
        logger.error(f"Error fetching products from Fake Store API: {e}")
        return []

def extract_category_from_query(query: str) -> Optional[str]:
    """
    Extract product category from query.
    Maps query keywords to Fake Store API categories.
    """
    query_lower = query.lower()

    category_mappings = {
        "electronics": ["electronics", "gadgets", "tech", "computer", "phone", "laptop"],
        "jewelery": ["jewelry", "jewellery", "necklace", "ring", "earring"],
        "men's clothing": ["men's", "men", "male", "shirt", "pants", "jacket"],
        "women's clothing": ["women's", "women", "female", "dress", "skirt", "blouse"]
    }

    for api_category, keywords in category_mappings.items():
        if any(keyword in query_lower for keyword in keywords):
            return api_category

    return None

def filter_products_by_query(products: List[Dict], query: str) -> List[Dict]:
    """
    Filter products based on query keywords in title, description, or category.
    """
    query_lower = query.lower()
    query_words = query_lower.split()

    filtered = []
    for product in products:
        searchable = f"{product.get('title', '')} {product.get('description', '')} {product.get('category', '')}".lower()

        # Check if any query word matches
        if any(word in searchable for word in query_words):
            filtered.append(product)

    return filtered

def get_fallback_products(query: str) -> List[Dict[str, Any]]:
    """
    Get fallback product recommendations from sample data.
    """
    from ..data.recommendations import products

    # Filter by query keywords if possible
    query_lower = query.lower()
    filtered_products = []

    for product in products:
        # Check if any word in query matches product name or category
        searchable = f"{product['name']} {product['category']}".lower()
        if any(word in searchable for word in query_lower.split()):
            filtered_products.append({
                "id": f"fallback_product_{len(filtered_products)}",
                "title": product["name"],
                "price": f"${product['price']:.2f}",
                "description": f"Great {product['category']} item: {product['name']}.",
                "image": f"https://placehold.co/400x400?text={product['name'].replace(' ', '+')}",
                "rating": "4.5/5",
                "category": product["category"],
                "type": "product"
            })

    # If no matches, return all products
    if not filtered_products:
        filtered_products = [{
            "id": f"fallback_product_{i}",
            "title": product["name"],
            "price": f"${product['price']:.2f}",
            "description": f"Great {product['category']} item: {product['name']}.",
            "image": f"https://placehold.co/400x400?text={product['name'].replace(' ', '+')}",
            "rating": "4.5/5",
            "category": product["category"],
            "type": "product"
        } for i, product in enumerate(products)]

    return filtered_products[:5]

async def get_product_recommendations(query: str) -> List[Dict[str, Any]]:
    """
    Get product recommendations, trying API first, then fallback to sample data.
    """
    # Try API first
    products = await fetch_products_from_fake_api(query)

    # If API fails or returns empty, use fallback
    if not products:
        logger.info("Using fallback product data")
        products = get_fallback_products(query)

    return products
