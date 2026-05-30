# backend/services/gemini.py
from typing import Dict, Any, Optional
import google.generativeai as genai
from backend.core.logging import logger
from backend.core.config import settings

class GeminiService:
    def __init__(self, api_key: Optional[str]):
        if api_key:
            genai.configure(api_key=api_key)
        self.client = genai

    async def generate_response(self, prompt: str, system_prompt: str = "You are a helpful assistant.") -> str:
        """
        Sends requests to Gemini API for various tasks.
        """
        if not settings.GEMINI_API_KEY:
            logger.warning("Gemini API key not configured. Returning mock response.")
            return "This is a mock response because the Gemini API key is missing."

        logger.info(
            "Sending payload request to Gemini model service",
            extra={
                "payload": {"prompt_length": len(prompt)}
            }
        )

        try:
            model = self.client.GenerativeModel('gemini-pro') # Or 'gemini-1.5-pro-latest' depending on access
            # Gemini's API for chat doesn't directly accept a 'system' role in the same way OpenAI does for `generate_content`
            # A common pattern is to bake the system prompt into the first user message or use tool_code functions.
            # For a direct chat-like interaction with a system prompt, we might need a more complex setup or initial message.
            # For now, I'll prepend the system prompt to the user prompt.
            full_prompt = f"{system_prompt}\n\n{prompt}"
            response = await model.generate_content_async(full_prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}")
            return f"Error: {str(e)}"

gemini_client = GeminiService(settings.GEMINI_API_KEY)
