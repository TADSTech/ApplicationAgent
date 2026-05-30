# backend/utils/currency.py
import httpx
from typing import Optional
from backend.services.currency_converter import currency_converter_service

# Base exchange rate utility. Defaults to 1550 NGN to 1 USD as a fallback.
FALLBACK_RATE = 1550.0

async def get_usd_to_ngn_rate() -> float:
    rate = await currency_converter_service.get_exchange_rate("USD", "NGN")
    if rate is None:
        rate = FALLBACK_RATE
    return rate

async def format_salary_display(salary_usd: float) -> str:
    """
    Formats a USD salary display with NGN equivalent.
    Example: $80,000 / yr (~₦124,000,000 NGN)
    """
    rate = await get_usd_to_ngn_rate()
    salary_ngn = salary_usd * rate
    formatted_usd = f"${salary_usd:,.0f}"
    formatted_ngn = f"₦{salary_ngn:,.0f}"
    return f"{formatted_usd} / yr (~{formatted_ngn} NGN)"
