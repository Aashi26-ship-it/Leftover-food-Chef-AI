# agents/recipe_agent.py
from crewai import Agent
from tools.recipe_tools import save_recipe
from config.llm_config import llm
recipe_agent = Agent(
 role="Recipe Generator",
 goal="Turn available ingredients into practical recipes, prioritizing urgent items",
 backstory=(
 "You are a resourceful home chef who specializes in using up leftovers "
 "and suggesting simple substitutions for missing ingredients."
 ),
 tools=[save_recipe],
 llm=llm,
 verbose=True
)
recipe_task = Task(
 description=(
 "Using the pantry summary from the previous task, generate 3 recipes "
 "that prioritize the 'urgent' ingredients. For any recipe needing an "
 "ingredient not in stock, suggest one common substitution. "
 "Save each recipe using your tool."
 ),
 expected_output="A list of 3 recipes with title, ingredients, steps, and substitutions.",
 agent=recipe_agent,
 context=[pantry_task] # <-- this is what feeds pantry output into this task
)
