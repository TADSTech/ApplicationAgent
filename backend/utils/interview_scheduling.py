
# backend/utils/interview_scheduling.py
from datetime import datetime, timedelta, timezone
from typing import List, Tuple, Optional

# Assuming WAT is UTC+1
WAT_OFFSET = timedelta(hours=1)

def convert_to_wat(dt: datetime, target_timezone_offset_hours: int) -> datetime:
    """
    Converts a datetime object from a given target timezone to WAT (UTC+1).
    The input dt is assumed to be in the target_timezone.
    """
    target_offset = timedelta(hours=target_timezone_offset_hours)
    utc_dt = dt - target_offset  # Convert target timezone time to UTC
    return utc_dt + WAT_OFFSET   # Convert UTC to WAT

def suggest_interview_slots(
    candidate_available_wat: List[Tuple[int, int]], # List of (start_hour, end_hour) in WAT
    interviewer_available_local: List[Tuple[int, int]], # List of (start_hour, end_hour) in local timezone
    interviewer_timezone_offset_hours: int # Offset from UTC for interviewer's local timezone
) -> List[Tuple[int, int]]:
    """
    Suggests overlapping interview slots in WAT, given candidate's availability in WAT
    and interviewer's availability in their local timezone.
    Returns a list of (start_hour_wat, end_hour_wat) for overlapping slots.
    """
    suggested_slots = []
    
    # Convert interviewer's availability to WAT
    interviewer_available_wat = []
    for start_local, end_local in interviewer_available_local:
        # Create dummy datetime objects for conversion. Date doesn't matter as we only care about time.
        dummy_date = datetime(2000, 1, 1)
        interviewer_start_dt_local = dummy_date.replace(hour=start_local)
        interviewer_end_dt_local = dummy_date.replace(hour=end_local)
        
        wat_start_dt = convert_to_wat(interviewer_start_dt_local, interviewer_timezone_offset_hours)
        wat_end_dt = convert_to_wat(interviewer_end_dt_local, interviewer_timezone_offset_hours)
        
        # Handle cases where the converted end time wraps to the next day
        if wat_end_dt < wat_start_dt:
            # This means the slot crosses midnight in WAT. Split it into two.
            interviewer_available_wat.append((wat_start_dt.hour, 24))
            interviewer_available_wat.append((0, wat_end_dt.hour))
        else:
            interviewer_available_wat.append((wat_start_dt.hour, wat_end_dt.hour))

    # Find overlaps
    for c_start, c_end in candidate_available_wat:
        for i_start, i_end in interviewer_available_wat:
            overlap_start = max(c_start, i_start)
            overlap_end = min(c_end, i_end)
            
            if overlap_start < overlap_end:
                suggested_slots.append((overlap_start, overlap_end))
                
    return suggested_slots

def get_current_wat_time() -> datetime:
    """
    Returns the current time in West African Time (WAT, UTC+1).
    """\n    return datetime.now(timezone.utc) + WAT_OFFSET
