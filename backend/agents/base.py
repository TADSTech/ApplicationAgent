# backend/agents/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from pydantic import BaseModel
try:
    from ..core.logging import logger
    from ..services.firebase import firebase_service
except ImportError:
    from backend.core.logging import logger
    from backend.services.firebase import firebase_service

class AgentState(BaseModel):
    session_id: str
    agent_type: str
    status: str          # "queued", "running", "completed", "failed"
    progress: float      # 0.0 to 100.0
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class BaseAgent(ABC):
    def __init__(self, agent_type: str, session_id: str):
        self.agent_type = agent_type
        self.session_id = session_id
        self.state = AgentState(
            session_id=session_id,
            agent_type=agent_type,
            status="queued",
            progress=0.0,
            started_at=datetime.now(timezone.utc)
        )

    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the agent's core reasoning logic.
        MUST handle exceptions, set self.state.status and progress.
        """
        pass

    def update_progress(self, progress: float, status: str = "running"):
        self.state.progress = progress
        self.state.status = status
        self._sync_state()
        logger.info(
            f"Agent {self.agent_type} progress updated",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"progress": progress, "status": status}
            }
        )

    def _sync_state(self):
        """
        Syncs current agent state to Firestore.
        Rule 4.3 compliant: Always save intermediate state to Firestore.
        """
        try:
            state_data = self.state.model_dump()
            firebase_service.update_agent_state(
                self.session_id, 
                self.agent_type, 
                state_data
            )
        except Exception as e:
            logger.error(f"Failed to sync agent state: {str(e)}")
