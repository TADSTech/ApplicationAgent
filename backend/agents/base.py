# backend/agents/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.core.logging import logger

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
            started_at=datetime.utcnow()
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
        logger.info(
            f"Agent {self.agent_type} progress updated",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"progress": progress, "status": status}
            }
        )
