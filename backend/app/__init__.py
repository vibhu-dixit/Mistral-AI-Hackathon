import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AI_SERVICE = ROOT / "ai-service"
if AI_SERVICE.exists() and str(AI_SERVICE) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE))
