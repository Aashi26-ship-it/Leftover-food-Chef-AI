# tools/planner_tools.py
import os
import requests
from crewai.tools import tool
from dotenv import load_dotenv

load_dotenv()
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")


@tool("Get Meal Plans")
def get_meal_plans() -> str:
    """Fetches existing meal plans from the backend."""
    response = requests.get(f"{BACKEND_BASE_URL}/mealplan")
    return response.json()


@tool("Save Meal Plan")
def save_meal_plan(meal_plan_json: str) -> str:
    """Sends the generated meal plan to the backend to be stored."""
    response = requests.post(f"{BACKEND_BASE_URL}/mealplan", json=meal_plan_json)
    return f"Saved with status {response.status_code}"