
# backend/services/currency_converter.py
import os
import httpx
import asyncio
from typing import Optional, Dict, Any
from backend.core.logging import logger
from backend.core.config import settings

class CurrencyConverterService:
    def __init__(self):
        self.api_key = os.getenv("EXCHANGERATE_API_KEY", "")
        self.base_url = "https://v6.exchangerate-api.com/v6"

    async def get_exchange_rate(self, base_currency: str, target_currency: str) -> Optional[float]:
        """
        Fetches the exchange rate between two currencies using ExchangeRate-API Pair endpoint with retries.
        Uses the correct endpoint format: GET /v6/API_KEY/pair/USD/NGN
        """
        if not self.api_key:
            logger.error("EXCHANGERATE_API_KEY is not set.", extra={"agent_type": "currency_converter_service"})
            return None

        # Use the Pair endpoint format: /v6/API_KEY/pair/USD/NGN
        url = f"{self.base_url}/{self.api_key}/pair/{base_currency}/{target_currency}"
        
        delay = 1.0
        max_retries = 3
        for attempt in range(max_retries + 1):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, timeout=5)
                    response.raise_for_status()
                    data = response.json()
                    
                    if data.get("result") == "success":
                        return data.get("conversion_rate")
                    else:
                        error_type = data.get("error-type", "Unknown error")
                        logger.warning(f"Failed to get exchange rate: {error_type}",
                                       extra={"agent_type": "currency_converter_service", "payload": data})
                        return None
            except (httpx.RequestError, httpx.HTTPStatusError) as e:
                if attempt == max_retries:
                    logger.error(f"HTTP request failed for exchange rate after {max_retries} retries: {e}",
                                 extra={"agent_type": "currency_converter_service", "error": str(e)})
                    return None
                logger.warning(f"Exchange rate request failed (attempt {attempt + 1}/{max_retries + 1}), retrying in {delay}s: {e}",
                               extra={"agent_type": "currency_converter_service", "error": str(e)})
                await asyncio.sleep(delay)
                delay *= 2
            except Exception as e:
                logger.error(f"An unexpected error occurred during exchange rate fetch: {e}",
                             extra={"agent_type": "currency_converter_service", "error": str(e)})
                return None

    async def convert_amount(self, amount: float, base_currency: str, target_currency: str) -> Optional[float]:
        """
        Converts an amount from one currency to another using the Pair endpoint with retries.
        Uses the endpoint format: GET /v6/API_KEY/pair/USD/NGN/AMOUNT
        """
        if not self.api_key:
            logger.error("EXCHANGERATE_API_KEY is not set.", extra={"agent_type": "currency_converter_service"})
            return None

        url = f"{self.base_url}/{self.api_key}/pair/{base_currency}/{target_currency}/{amount}"
        
        delay = 1.0
        max_retries = 3
        for attempt in range(max_retries + 1):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, timeout=5)
                    response.raise_for_status()
                    data = response.json()
                    
                    if data.get("result") == "success":
                        return data.get("conversion_result")
                    else:
                        error_type = data.get("error-type", "Unknown error")
                        logger.warning(f"Failed to convert amount: {error_type}",
                                       extra={"agent_type": "currency_converter_service", "payload": data})
                        return None
            except (httpx.RequestError, httpx.HTTPStatusError) as e:
                if attempt == max_retries:
                    logger.error(f"HTTP request failed for amount conversion after {max_retries} retries: {e}",
                                 extra={"agent_type": "currency_converter_service", "error": str(e)})
                    return None
                logger.warning(f"Amount conversion request failed (attempt {attempt + 1}/{max_retries + 1}), retrying in {delay}s: {e}",
                               extra={"agent_type": "currency_converter_service", "error": str(e)})
                await asyncio.sleep(delay)
                delay *= 2
            except Exception as e:
                logger.error(f"An unexpected error occurred during amount conversion: {e}",
                             extra={"agent_type": "currency_converter_service", "error": str(e)})
                return None


    async def get_cost_of_living_comparison(self, city1: str, city2: str) -> Optional[Dict[str, Any]]:
        """
        (Placeholder) Fetches cost of living comparison data.
        In a real application, this would integrate with a cost-of-living API like Numbeo.
        """
        logger.info(f"Fetching cost of living comparison for {city1} vs {city2} (placeholder).",
                    extra={"agent_type": "currency_converter_service", "payload": {"city1": city1, "city2": city2}})
        # Mock data for demonstration
        if city1.lower() == "lagos" and city2.lower() == "london":
            return {
                "city1": "Lagos, Nigeria",
                "city2": "London, UK",
                "cost_of_living_index_comparison": {"rent_difference": "-70%", "consumer_prices_difference": "-50%"},
                "details": "This is mock data. Integration with a real COL API is required."
            }
        return None

currency_converter_service = CurrencyConverterService()
