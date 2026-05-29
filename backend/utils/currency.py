# backend/utils/currency.py
import httpx
from typing import Optional

# Base exchange rate utility. Defaults to 1550 NGN to 1 USD as a fallback.
FALLBACK_RATE = 1550.0

def get_usd_to_ngn_rate() -> float:
    """
    Fetches the current exchange rate from USD to NGN.
    Falls back to a hardcoded rate if the API request fails.
    """
    try:
        # Using a free exchange rate API with a timeout
        response = httpx.get("https://open.er-api.com/v6/latest/USD", timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            rate = data.get("rates", {}).get("NGN")
            if rate:
                return float(rate)
    except Exception:
        pass
    return FALLBACK_RATE

def format_salary_display(salary_usd: float) -> str:
    """
    Formats a USD salary display with NGN equivalent.
    Example: $80,000 / yr (~₦124,000,000 NGN)
    """
    rate = get_usd_to_ngn_rate()
    salary_ngn = salary_usd * rate
    formatted_usd = f"${salary_usd:,.0f}"
    formatted_ngn = f"₦{salary_ngn:,.0f}"
    return f"{formatted_usd} / yr (~{formatted_ngn} NGN)"
