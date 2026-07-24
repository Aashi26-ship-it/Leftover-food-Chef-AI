# agents/meal_planner_agent.py
from crewai import Agent, Task
from tools.planner_tools import save_meal_plan
from config.llm_config import llm
meal_planner_agent = Agent(
 role="Meal Planner",
 goal="Organize recipes into a balanced multi-day meal plan",
 backstory="You arrange meals across the week, avoiding repeats and balancing variety.",
 tools=[save_meal_plan],
 llm=llm,
 verbose=True
)
meal_planner_task = Task(
 description=(
 "Using the generated recipes, arrange them into a 5-day meal plan "
 "(breakfast/lunch/dinner where recipes allow). Do not repeat the same "
 "dish more than once. Save the plan using your tool."
 ),
 expected_output="A JSON meal plan keyed by day and meal slot.",
 agent=meal_planner_agent,
 context=[recipe_task]
)