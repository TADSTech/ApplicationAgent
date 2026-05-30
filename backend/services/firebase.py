# backend/services/firebase.py
import firebase_admin
from firebase_admin import credentials, firestore
from backend.core.config import settings
from backend.core.logging import logger
from typing import Dict, Any, Optional

class FirebaseService:
    _instance = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseService, cls).__new__(cls)
            cls._initialize_firebase()
        return cls._instance

    @classmethod
    def _initialize_firebase(cls):
        try:
            if not firebase_admin._apps:
                if settings.FIREBASE_CREDENTIALS_PATH:
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred, {
                        'projectId': settings.FIRESTORE_PROJECT_ID,
                    })
                else:
                    # Fallback to default credentials (useful in Cloud Run environment)
                    firebase_admin.initialize_app()
                
            cls._db = firestore.client()
            logger.info("Firebase Admin SDK initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
            # For local dev without credentials, we might want to continue without DB
            # but in production this should be a hard failure.
            cls._db = None

    def get_db(self):
        return self._db

    def update_agent_state(self, session_id: str, agent_type: str, state: Dict[str, Any]):
        if not self._db:
            logger.warning("Firestore DB not initialized. Skipping state update.")
            return

        try:
            doc_ref = self._db.collection("sessions").document(session_id).collection("agents").document(agent_type)
            doc_ref.set(state, merge=True)
            logger.debug(f"Agent {agent_type} state updated in Firestore for session {session_id}")
        except Exception as e:
            logger.error(f"Error updating agent state in Firestore: {str(e)}")

firebase_service = FirebaseService()
