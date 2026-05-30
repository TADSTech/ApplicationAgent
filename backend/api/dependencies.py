# backend/api/dependencies.py
from fastapi import Header, HTTPException, status
from firebase_admin import auth
from backend.core.logging import logger

async def verify_firebase_token(authorization: str = Header(None)):
    """
    Dependency to verify Firebase authentication JWT headers.
    Uses firebase_admin.auth to verify the token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(" ")[1]
    
    # Development bypass for mock token
    if token == "mock-firebase-jwt":
        return {"uid": "user-123", "email": "nigerian.dev@gmail.com"}
    
    try:
        # Verify the ID token while checking if the token is revoked by passing check_revoked=True
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except Exception as e:
        logger.error(
            "Token verification failed",
            extra={
                "payload": {"error": str(e)}
            }
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )
