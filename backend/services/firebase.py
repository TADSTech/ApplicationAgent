# backend/services/firebase.py
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, Optional
from backend.core.config import settings
from backend.core.logging import logger
from backend.core.state import active_sessions

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
                if settings.resolved_credentials_path:
                    cred = credentials.Certificate(settings.resolved_credentials_path)
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
        # Keep an in-memory cache of agent states to support local/offline mode
        try:
            if session_id not in active_sessions:
                active_sessions[session_id] = {}
            active_sessions[session_id][agent_type] = state
        except Exception as e:
            logger.error(f"Error updating in-memory agent state: {str(e)}")

        if not self._db:
            logger.warning("Firestore DB not initialized. Skipping Firestore state update.")
            return

        try:
            doc_ref = self._db.collection("sessions").document(session_id).collection("agents").document(agent_type)
            doc_ref.set(state, merge=True)
            logger.debug(f"Agent {agent_type} state updated in Firestore for session {session_id}")
        except Exception as e:
            logger.error(f"Error updating agent state in Firestore: {str(e)}")

    def get_agent_states(self, session_id: str) -> list[Dict[str, Any]]:
        # Fetch from in-memory cache first
        in_memory_states = active_sessions.get(session_id, {})
        
        # Merge with Firestore if database is available
        if self._db:
            try:
                agents_ref = self._db.collection("sessions").document(session_id).collection("agents")
                docs = agents_ref.stream()
                for doc in docs:
                    agent_type = doc.id
                    if agent_type not in in_memory_states:
                        in_memory_states[agent_type] = doc.to_dict()
            except Exception as e:
                logger.error(f"Error fetching agent states from Firestore: {str(e)}")
                
        states_list = list(in_memory_states.values())
        
        # Map snake_case database keys to camelCase frontend keys
        for state in states_list:
            if "session_id" in state:
                state["sessionId"] = state["session_id"]
            if "agent_type" in state:
                state["agentType"] = state["agent_type"]
            if "started_at" in state:
                val = state["started_at"]
                state["startedAt"] = val.isoformat() if hasattr(val, "isoformat") else val
            if "completed_at" in state:
                val = state["completed_at"]
                state["completedAt"] = val.isoformat() if hasattr(val, "isoformat") else val
                
        return states_list

firebase_service = FirebaseService()
