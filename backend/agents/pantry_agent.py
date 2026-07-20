def pantry_agent(ingredients):
    items = [item.strip() for item in ingredients.split(",")]

    return {
        "available_ingredients": items,
        "priority": items[0] if items else None
    }