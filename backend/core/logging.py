# backend/core/logging.py
import logging
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        # Extract fields specified in Rule 4.2
        # Standard record attributes + custom 'extra' attributes
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "trace_id": getattr(record, "trace_id", ""),
            "session_id": getattr(record, "session_id", ""),
            "agent_type": getattr(record, "agent_type", "orchestrator"),
            "level": record.levelname,
            "message": record.getMessage(),
            "payload": getattr(record, "payload", {})
        }
        return json.dumps(log_data)

def setup_logging(level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("jobjockey")
    logger.setLevel(level)
    
    # Avoid duplicate handlers if already set up
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        
    return logger

# Single instance for the application
logger = setup_logging()
