# backend/core/state.py
from typing import Dict, Any, Optional

# Active in-memory session tracking for development/websockets/state caching
active_sessions: Dict[str, Any] = {}

def get_session_state(session_id: str) -> Optional[Dict[str, Any]]:
    return active_sessions.get(session_id)

def set_session_state(session_id: str, state: Dict[str, Any]) -> None:
    active_sessions[session_id] = state
