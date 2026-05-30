# backend/tests/test_utils.py
import pytest
from unittest.mock import patch, MagicMock
from backend.utils.currency import get_usd_to_ngn_rate, format_salary_display
from backend.utils.timezones import calculate_wat_overlap

def test_currency_formatting():
    # Mock rate to 1600 for predictable output
    with patch("backend.utils.currency.get_usd_to_ngn_rate", return_value=1600.0):
        display = format_salary_display(100000.0)
        assert "$100,000" in display
        assert "₦160,000,000" in display

def test_timezone_overlap_pst():
    # PST (UTC-8) 9 AM - 5 PM is 6 PM - 2 AM WAT
    wat_start, wat_end, is_late_night = calculate_wat_overlap("PST")
    assert wat_start == 18
    assert wat_end == 2
    assert is_late_night is True

def test_timezone_overlap_cet():
    # CET (UTC+1) 9 AM - 5 PM is 9 AM - 5 PM WAT
    wat_start, wat_end, is_late_night = calculate_wat_overlap("CET")
    assert wat_start == 9
    assert wat_end == 17
    assert is_late_night is False
