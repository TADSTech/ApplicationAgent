# backend/api/dependencies.py
from fastapi import Header, HTTPException, status
from firebase_admin import auth
from core.logging import logger
from core.config import settings
import requests
from typing import Dict, Any, Optional


def sign_in_with_google(web_api_key: str, google_id_token: str) -> Optional[Dict[str, Any]]:
    """
    Signs into Firebase Authentication using a raw Google ID token.
    This exchanges a Google OAuth id_token for a Firebase ID token + user info.
    Only used when the client sends a raw Google token (not a Firebase ID token).
    """
    if not web_api_key:
        return None

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key={web_api_key}"

    payload = {
        "postBody": f"id_token={google_id_token}&providerId=google.com",
        "requestUri": "http://localhost",
        "returnIdpCredential": True,
        "returnSecureToken": True,
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200:
            logger.info("Successfully authenticated with Firebase via Google ID Token")
            firebase_id_token = response_data.get("idToken")
            refresh_token = response_data.get("refreshToken")
            local_id = response_data.get("localId")

            return {
                "firebase_id_token": firebase_id_token,
                "refresh_token": refresh_token,
                "uid": local_id,
                "email": response_data.get("email"),
                "displayName": response_data.get("displayName"),
                "user_info": response_data.get("rawUserInfo"),
            }
        else:
            error_msg = response_data.get("error", {}).get("message", "Unknown")
            logger.warning(f"Google Token exchange failed: {error_msg}")
            return None

    except Exception as e:
        logger.error(f"Network error during Google ID token exchange: {e}")
        return None


async def verify_firebase_token(authorization: str = Header(None)):
    """
    Dependency to verify Firebase authentication JWT headers.

    Flow:
    1. Check for mock tokens (dev bypass)
    2. Try firebase_admin.auth.verify_id_token() — this handles tokens from
       signInWithPopup / signInWithEmailAndPassword (the normal frontend flow)
    3. If that fails AND FIREBASE_WEB_API_KEY is set, try exchanging the token
       as a raw Google ID token via the Identity Toolkit REST API (fallback)
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )

    token = authorization.split(" ")[1]

    # Development bypass for mock tokens
    if token in ("mock-firebase-jwt", "mock-backend-token"):
        return {"uid": "user-123", "email": "nigerian.dev@gmail.com"}

    # Step 1: Try verifying as a Firebase ID token (the normal path)
    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        logger.info(
            "Firebase ID token verified successfully",
            extra={"payload": {"uid": decoded_token.get("uid")}}
        )
        return decoded_token
    except Exception as firebase_err:
        logger.warning(
            f"Firebase ID token verification failed, will try Google exchange: {firebase_err}"
        )

    # Step 2: Fallback — try exchanging as a raw Google ID token
    if settings.FIREBASE_WEB_API_KEY:
        google_auth = sign_in_with_google(settings.FIREBASE_WEB_API_KEY, token)
        if google_auth:
            return {
                "uid": google_auth["uid"],
                "email": google_auth.get("email") or "",
                "name": google_auth.get("displayName") or "Google User"
            }

    # Both paths failed
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token verification failed. Please sign in again."
    )
