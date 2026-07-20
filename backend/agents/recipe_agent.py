from gemini_service import generate_recipe


def recipe_agent(pantry_data):

    prompt = f"""
    You are a Recipe Agent.

    Available ingredients:
    {pantry_data}

    Suggest a recipe.
    Include:
    - Recipe name
    - Ingredients
    - Cooking steps
    - Cooking time
    """

    return generate_recipe(prompt)