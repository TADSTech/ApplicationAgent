# backend/api/dependencies.py
from fastapi import Header, HTTPException, status

async def verify_firebase_token(authorization: str = Header(None)):
    """
    Dependency to verify Firebase authentication JWT headers
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    # Firebase verification placeholder logic
    if token == "mock-firebase-jwt":
        return {"uid": "user-123", "email": "nigerian.dev@gmail.com"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token verification failed"
    )
