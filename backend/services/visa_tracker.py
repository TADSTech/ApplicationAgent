
# backend/services/visa_tracker.py
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from ..models.visa import VisaSponsorship, VisaStatusUpdate
from ..core.logging import logger
from ..services.firebase import firebase_service

class VisaTrackerService:
    def __init__(self):
        self.db = firebase_service.get_db()

    async def add_or_update_visa_sponsorship(self, sponsorship_data: VisaSponsorship) -> bool:
        """
        Adds a new visa sponsorship entry or updates an existing one.
        """
        if not self.db:
            logger.warning("Firestore DB not initialized. Skipping visa sponsorship add/update.")
            return False
        try:
            doc_ref = self.db.collection("visa_sponsorships").document(sponsorship_data.company_name.lower())
            sponsorship_dict = sponsorship_data.model_dump()
            sponsorship_dict["last_updated"] = datetime.now(timezone.utc) # Ensure UTC timestamp
            await doc_ref.set(sponsorship_dict, merge=True)
            logger.info(
                f"Visa sponsorship for {sponsorship_data.company_name} added/updated.",
                extra={
                    "agent_type": "visa_tracker_service",
                    "payload": {"company": sponsorship_data.company_name, "action": "add_update"}
                }
            )
            return True
        except Exception as e:
            logger.error(f"Failed to add/update visa sponsorship: {e}", extra={"agent_type": "visa_tracker_service", "error": str(e)})
            return False

    async def get_visa_sponsorship(self, company_name: str) -> Optional[VisaSponsorship]:
        """
        Retrieves visa sponsorship information for a given company.
        """
        if not self.db:
            logger.warning("Firestore DB not initialized. Skipping visa sponsorship retrieval.")
            return None
        try:
            doc_ref = self.db.collection("visa_sponsorships").document(company_name.lower())
            doc = await doc_ref.get()
            if doc.exists:
                return VisaSponsorship(**doc.to_dict())
            return None
        except Exception as e:
            logger.error(f"Failed to retrieve visa sponsorship: {e}", extra={"agent_type": "visa_tracker_service", "error": str(e)})
            return None

    async def add_visa_status_update(self, update_data: VisaStatusUpdate) -> bool:
        """
        Adds a new visa status update for a company.
        """
        if not self.db:
            logger.warning("Firestore DB not initialized. Skipping visa status update.")
            return False
        try:
            doc_ref = self.db.collection("visa_status_updates").document()
            update_dict = update_data.model_dump()
            update_dict["date_recorded"] = datetime.now(timezone.utc) # Ensure UTC timestamp
            await doc_ref.set(update_dict)
            logger.info(
                f"Visa status update for {update_data.company_name} recorded.",
                extra={
                    "agent_type": "visa_tracker_service",
                    "payload": {"company": update_data.company_name, "status": update_data.status}
                }
            )
            return True
        except Exception as e:
            logger.error(f"Failed to add visa status update: {e}", extra={"agent_type": "visa_tracker_service", "error": str(e)})
            return False

# Initialize the service (can be done via FastAPI dependency injection in a real app)
visa_tracker_service = VisaTrackerService()
