from gemini_service import generate_recipe


def recipe_agent(pantry_data: list[str]) -> str:
    return generate_recipe(pantry_data)
