# agents/pantry_agent.py
from crewai import Agent
from tools.pantry_tools import get_pantry_items
from config.llm_config import llm

pantry_agent = Agent(
    role="Pantry Analyst",
    goal="Identify available ingredients and flag items close to expiry",
    backstory="You track what the user has at home and what needs to be used soon.",
    tools=[get_pantry_items],
    llm=llm,
    verbose=True
)