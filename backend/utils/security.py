import hashlib

def hash_password(password: str) -> str:
    """Return a sha256 hash for a plain password (demo only)."""
    if password is None:
        password = ""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against a sha256 hash."""
    return hash_password(plain) == (hashed or "")
