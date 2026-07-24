# tools/recipe_tools.py
import os
import requests
from crewai.tools import tool
from dotenv import load_dotenv

load_dotenv()
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")


@tool("Generate Recipe")
def generate_recipe(recipe_request_json: str) -> str:
    """Sends pantry/ingredient data to the backend's recipe generator
    and returns the generated recipe(s)."""
    response = requests.post(f"{BACKEND_BASE_URL}/recipe", json=recipe_request_json)
    return response.json()