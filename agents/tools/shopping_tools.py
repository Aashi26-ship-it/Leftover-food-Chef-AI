# tools/shopping_tools.py
import os
import requests
from crewai.tools import tool
from dotenv import load_dotenv

load_dotenv()
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")


@tool("Get Missing Items")
def get_missing_items() -> str:
    """Fetches current pantry stock to compare against planned meals."""
    response = requests.get(f"{BACKEND_BASE_URL}/pantry/")
    return response.json()


@tool("Save Shopping List")
def save_shopping_list(shopping_list_json: str) -> str:
    """Sends the final shopping list to the backend to be stored."""
    response = requests.post(f"{BACKEND_BASE_URL}/shopping", json=shopping_list_json)
    return f"Saved with status {response.status_code}"