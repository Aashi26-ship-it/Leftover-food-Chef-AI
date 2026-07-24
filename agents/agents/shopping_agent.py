# agents/shopping_agent.py
from crewai import Agent, Task
from tools.shopping_tools import get_missing_items, save_shopping_list
from config.llm_config import llm
shopping_agent = Agent(
 role="Shopping List Builder",
 goal="Determine which ingredients are missing for the planned meals and list them",
 backstory="You compare planned recipes against pantry stock and prepare a shopping list.",
 tools=[get_missing_items, save_shopping_list],
 llm=llm,
 verbose=True
)
shopping_task = Task(
 description=(
 "Compare the ingredients required by the planned meals against the pantry "
 "summary. Output only the ingredients that are missing or insufficient in "
 "quantity, with the amount needed. Save the list using your tool."
 ),
 expected_output="A JSON shopping list: [{name, quantity_needed}]",
 agent=shopping_agent,
 context=[pantry_task, recipe_task]
)