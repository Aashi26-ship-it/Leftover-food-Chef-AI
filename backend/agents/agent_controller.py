"""Sequential orchestration for the recipe workflow.

The previous LangGraph graph was compiled at module import time even though the
workflow is a single fixed sequence. Keeping it as normal functions removes
startup work and lets health/docs endpoints start without AI dependencies.
"""

import logging

from .meal_planner_agent import meal_planner_agent
from .pantry_agent import pantry_agent
from .recipe_agent import recipe_agent
from .shopping_agent import shopping_agent

logger = logging.getLogger(__name__)


def run_agents(ingredients: list[str], request_id: str = "-") -> dict[str, object]:
    logger.info("request_id=%s workflow started", request_id)

    logger.info("request_id=%s PantryAgent started", request_id)
    pantry = pantry_agent(ingredients)
    logger.info("request_id=%s PantryAgent completed", request_id)

    logger.info("request_id=%s RecipeAgent started", request_id)
    recipe = recipe_agent(pantry["available_ingredients"], request_id)
    logger.info("request_id=%s RecipeAgent completed", request_id)

    logger.info("request_id=%s MealPlannerAgent started", request_id)
    meal_plan = meal_planner_agent(pantry["available_ingredients"])
    logger.info("request_id=%s MealPlannerAgent completed", request_id)

    logger.info("request_id=%s ShoppingAgent started", request_id)
    shopping = shopping_agent(recipe)
    logger.info("request_id=%s ShoppingAgent completed", request_id)

    logger.info("request_id=%s workflow completed", request_id)
    return {
        "pantry": pantry,
        "recipe": recipe,
        "meal_plan": meal_plan,
        "shopping": shopping,
    }
