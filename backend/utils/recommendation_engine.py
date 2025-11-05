import random
from typing import List, Dict
from data import recommendations as rec
from data.users import users


def _find_user(username: str) -> Dict:
    for u in users:
        if u["username"].lower() == username.lower():
            return u
    return {}


def _get_dataset(category: str) -> List[Dict]:
    cat = category.lower()
    if cat == "movies":
        return rec.movies
    if cat == "books":
        return rec.books
    if cat == "comics":  # map comics to books dataset for now
        return rec.books
    if cat == "blogs":
        return rec.blogs
    if cat == "products":
        return rec.products
    return []


def get_recommendations(username: str, category: str) -> List[Dict]:
    user = _find_user(username)
    if not user:
        return []

    prefs = user.get("preferences", {})
    pref_genres = set((prefs.get("genres") or []))
    pref_keywords = set((prefs.get("keywords") or []))

    items = _get_dataset(category)
    if not items:
        return []

    def match_item(it: Dict) -> bool:
        # Try to match on genre/topic/category and keywords present in title/tags/name/author
        text_fields = " ".join([str(it.get(k, "")) for k in ("title", "name", "author", "topic")]).lower()
        tags = set(map(str.lower, it.get("tags", [])))
        item_genre = (it.get("genre") or it.get("topic") or it.get("category") or "").lower()
        genre_match = (not pref_genres) or (item_genre in pref_genres)
        keyword_match = (not pref_keywords) or any(kw.lower() in text_fields or kw.lower() in tags for kw in pref_keywords)
        return genre_match or keyword_match

    matched = [it for it in items if match_item(it)]
    if not matched:
        matched = items[:]

    random.shuffle(matched)
    return matched[:5]
