# backend/services/linkedin.py
from typing import Dict, Any
import asyncio
from backend.core.logging import logger

class LinkedInService:
    def __init__(self):
        logger.warning("LinkedIn API keys are removed for MVP. Using mock functionality.")

    async def send_connect_request(self, profile_id: str, message: str) -> bool:
        """
        Automates connection requests.
        """
        logger.info(
            "Mocking LinkedIn Connection request to API",
            extra={
                "agent_type": "linkedin",
                "payload": {"profile_id": profile_id}
            }
        )
        # Simulate API call delay
        await asyncio.sleep(0.5)
        return True

    async def send_direct_message(self, chat_id: str, text: str) -> bool:
        """
        Automates follow-up DMs to connection recipients.
        """
        logger.info(
            "Mocking LinkedIn Direct Message",
            extra={
                "agent_type": "linkedin",
                "payload": {"chat_id": chat_id, "text_length": len(text)}
            }
        )
        # Simulate API call delay
        await asyncio.sleep(0.5)
        return True

# Global instance
linkedin_service = LinkedInService()
