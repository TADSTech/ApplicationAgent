# backend/services/openai.py
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from backend.core.logging import logger

class OpenAIService:
    def __init__(self, api_key: Optional[str]):
        self.client = AsyncOpenAI(api_key=api_key) if api_key else None

    async def generate_response(self, prompt: str, system_prompt: str = "You are a helpful assistant.") -> str:
        """
        Sends requests to OpenAI API for resume tuning or contract auditing.
        """
        if not self.client:
            logger.warning("OpenAI API key not configured. Returning mock response.")
            return "This is a mock response because the OpenAI API key is missing."

        logger.info(
            "Sending payload request to OpenAI model service",
            extra={
                "payload": {"prompt_length": len(prompt)}
            }
        )

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}")
            return f"Error: {str(e)}"
