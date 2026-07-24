# tools/pantry_tools.py
import os
import requests
from crewai.tools import tool
from dotenv import load_dotenv

load_dotenv()
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")


@tool("Get Pantry Items")
def get_pantry_items() -> str:
    """Fetches the current list of pantry items from the backend API."""
    response = requests.get(f"{BACKEND_BASE_URL}/pantry/")
    return response.json()


@tool("Add Pantry Item")
def add_pantry_item(item_json: str) -> str:
    """Adds a new item to the pantry via the backend API."""
    response = requests.post(f"{BACKEND_BASE_URL}/pantry/add", json=item_json)
    return f"Added with status {response.status_code}"