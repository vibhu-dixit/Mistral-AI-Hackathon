from .models import Observation


async def analyze_observation(observation: Observation) -> Observation:
    """Fixture adapter; replace its internals with the ai-service call."""
    observation.hazard_type = "pothole"
    observation.severity = "urgent"
    observation.confidence = 0.92
    observation.description = "Road surface damage detected in the uploaded image."
    observation.processing_status = "complete"
    return observation
