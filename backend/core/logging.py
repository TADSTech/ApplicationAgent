# backend/core/logging.py
import logging
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        # Default empty dict or context from extra
        extra = getattr(record, "extra", {}) or {}
        trace_id = extra.get("trace_id", "")
        session_id = extra.get("session_id", "")
        agent_type = extra.get("agent_type", "orchestrator")
        payload = extra.get("payload", {})
        
        # Build structured log
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "trace_id": trace_id,
            "session_id": session_id,
            "agent_type": agent_type,
            "level": record.levelname,
            "message": record.getMessage(),
            "payload": payload
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
