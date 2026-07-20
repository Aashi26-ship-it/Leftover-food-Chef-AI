from .pantry_agent import pantry_agent
from .recipe_agent import recipe_agent
from .meal_planner_agent import meal_planner_agent
from .shopping_agent import shopping_agent


def run_agents(ingredients):

    pantry = pantry_agent(ingredients)

    recipe = recipe_agent(
        pantry["available_ingredients"]
    )

    meal_plan = meal_planner_agent(
        pantry["available_ingredients"]
    )

    shopping = shopping_agent(recipe)


    return {
        "pantry": pantry,
        "recipe": recipe,
        "meal_plan": meal_plan,
        "shopping": shopping
    }