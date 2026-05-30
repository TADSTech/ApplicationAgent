# backend/agents/orchestrator.py
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from backend.agents.base import BaseAgent
from backend.core.logging import logger

class MultiAgentOrchestrator:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.agents: Dict[str, BaseAgent] = {}

    def register_agent(self, agent: BaseAgent) -> None:
        self.agents[agent.agent_type] = agent

    async def execute_agent_with_retry(self, agent_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes a registered agent with exponential backoff retry logic.
        Rule 4.1 compliant:
        - Initial Retry Delay: 1 second
        - Multiplier: 2x
        - Max Retries: 3
        """
        agent = self.agents.get(agent_type)
        if not agent:
            raise ValueError(f"Agent {agent_type} is not registered in this orchestrator session.")

        retries = 0
        delay = 1.0
        max_retries = 3

        logger.info(
            f"Starting execution of {agent_type} agent",
            extra={
                "session_id": self.session_id,
                "agent_type": "orchestrator",
                "payload": {"agent_type": agent_type, "retry_count": retries}
            }
        )

        agent.state.status = "running"
        agent.state.started_at = datetime.now(timezone.utc)
        await agent._sync_state()

        while retries <= max_retries:
            try:
                result = await agent.run(context)
                agent.state.status = "completed"
                agent.state.progress = 100.0
                agent.state.result = result
                agent.state.completed_at = datetime.now(timezone.utc)
                await agent._sync_state()
                
                logger.info(
                    f"Agent {agent_type} completed successfully",
                    extra={
                        "session_id": self.session_id,
                        "agent_type": "orchestrator",
                        "payload": {"agent_type": agent_type, "retries": retries}
                    }
                )
                return result

            except Exception as e:
                retries += 1
                logger.warning(
                    f"Agent {agent_type} failed. Attempt {retries}/{max_retries + 1}",
                    extra={
                        "session_id": self.session_id,
                        "agent_type": "orchestrator",
                        "payload": {"agent_type": agent_type, "error": str(e), "backoff_delay": delay}
                    }
                )
                if retries <= max_retries:
                    await asyncio.sleep(delay)
                    delay *= 2.0
                else:
                    agent.state.status = "failed"
                    agent.state.error = str(e)
                    agent.state.completed_at = datetime.now(timezone.utc)
                    await agent._sync_state()
                    logger.error(
                        f"Agent {agent_type} exhausted all retries",
                        extra={
                            "session_id": self.session_id,
                            "agent_type": "orchestrator",
                            "payload": {"agent_type": agent_type, "error": str(e)}
                        }
                    )
                    return {"status": "failed", "error": str(e)}
                    
        return {"status": "failed", "error": "Unknown execution failure"}
