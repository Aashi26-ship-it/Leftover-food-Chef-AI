
# config/llm_config.py
import os
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Make sure it's set in your .env file "
        "inside the agents/ folder."
    )

llm = LLM(
    model="gemini/gemini-3.5-flash",
    api_key=GEMINI_API_KEY
)