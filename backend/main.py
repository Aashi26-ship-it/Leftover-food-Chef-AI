from fastapi import FastAPI
from gemini_service import generate_recipe

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to Leftover Food Chef AI"}

@app.get("/recipe")
def recipe(ingredients: str):
    prompt = f"""
    I have these ingredients:
    {ingredients}

    Suggest one easy recipe.
    Give:
    1. Recipe Name
    2. Ingredients
    3. Steps
    """
    
    result = generate_recipe(prompt)
    return {"recipe": result}