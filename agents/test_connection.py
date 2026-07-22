
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai import LLM

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

llm = LLM(model="gemini/gemini-2.5-flash", api_key=api_key)

tester = Agent(
    role="Connection Tester",
    goal="Confirm the AI pipeline is wired correctly",
    backstory="You are a simple diagnostic agent.",
    llm=llm
)

task = Task(
    description="Reply with the single word CONNECTED if you can read this.",
    expected_output="The word CONNECTED",
    agent=tester
)

crew = Crew(agents=[tester], tasks=[task])
result = crew.kickoff()
print(result)