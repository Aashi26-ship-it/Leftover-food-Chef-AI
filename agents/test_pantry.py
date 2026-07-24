# test_pantry.py
from crewai import Task, Crew
from agents.pantry_agent import pantry_agent

pantry_task = Task(
    description=(
        "Fetch the pantry items using your tool. Return a structured list "
        "of ingredients, grouped into 'use urgently' (expiring in 3 days or less) "
        "and 'general stock'."
    ),
    expected_output="A JSON object with keys 'urgent' and 'general_stock'.",
    agent=pantry_agent
)

crew = Crew(agents=[pantry_agent], tasks=[pantry_task])
result = crew.kickoff()
print(result)