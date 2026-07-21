def pantry_agent(ingredients: list[str]) -> dict[str, object]:
    """Build pantry data from ingredients already validated at the API boundary."""
    items = ingredients

    return {
        "available_ingredients": items,
        "priority": items[0] if items else None
    }
