# backend/utils/timezones.py
from datetime import datetime
from typing import Dict, Any, Tuple

# WAT is UTC+1.
# EST/EDT is UTC-5/UTC-4.
# PST/PDT is UTC-8/UTC-7.
# CET/CEST is UTC+1/UTC+2.

TIMEZONE_OFFSETS = {
    "WAT": 1,
    "EST": -5,
    "PST": -8,
    "GMT": 0,
    "CET": 1,
    "BST": 1,
}

def calculate_wat_overlap(job_timezone: str, core_hours_start_local: int = 9, core_hours_end_local: int = 17) -> Tuple[int, int, bool]:
    """
    Calculates the corresponding core hours in WAT (UTC+1) for a given job timezone's local core hours.
    Returns: (wat_start_hour, wat_end_hour, is_late_night_shift)
    A late night shift is defined as any shift ending after 10 PM (22:00) WAT or starting after 6 PM (18:00) WAT.
    """
    job_tz = job_timezone.upper()
    job_offset = TIMEZONE_OFFSETS.get(job_tz, 0)
    
    # Difference to WAT (UTC+1)
    # If job is in PST (UTC-8), diff is +1 - (-8) = +9 hours
    diff = 1 - job_offset
    
    wat_start = (core_hours_start_local + diff) % 24
    wat_end = (core_hours_end_local + diff) % 24
    
    # Check if this corresponds to a late night shift (e.g. core working hours fall inside 6 PM to 6 AM WAT)
    # If the end hour is late, or start is late
    is_late_night = False
    
    # Check if any part of the active hours intersects 18:00 - 06:00 WAT
    # For PST 9 AM - 5 PM (17:00), WAT is 6 PM (18:00) to 2 AM (02:00). This is definitely late night.
    if wat_end > 22 or wat_start >= 18 or wat_end < wat_start:
        is_late_night = True
        
    return wat_start, wat_end, is_late_night
