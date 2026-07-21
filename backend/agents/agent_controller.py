import logging
from typing import TypedDict

from langgraph.graph import StateGraph, END

from .pantry_agent import pantry_agent
from .recipe_agent import recipe_agent
from .meal_planner_agent import meal_planner_agent
from .shopping_agent import shopping_agent

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    ingredients: list[str]
    request_id: str
    pantry: dict
    recipe: str
    meal_plan: dict
    shopping: dict


# -------- Nodes --------

def pantry_node(state: AgentState):
    logger.info("request_id=%s PantryAgent started", state["request_id"])
    pantry = pantry_agent(state["ingredients"])
    logger.info("request_id=%s PantryAgent completed", state["request_id"])
    return {"pantry": pantry}


def recipe_node(state: AgentState):
    logger.info("request_id=%s RecipeAgent started", state["request_id"])
    recipe = recipe_agent(
        state["pantry"]["available_ingredients"], state["request_id"]
    )
    logger.info("request_id=%s RecipeAgent completed", state["request_id"])
    return {"recipe": recipe}


def meal_plan_node(state: AgentState):
    logger.info("request_id=%s MealPlannerAgent started", state["request_id"])
    meal_plan = meal_planner_agent(
        state["pantry"]["available_ingredients"]
    )
    logger.info("request_id=%s MealPlannerAgent completed", state["request_id"])
    return {"meal_plan": meal_plan}


def shopping_node(state: AgentState):
    logger.info("request_id=%s ShoppingAgent started", state["request_id"])
    shopping = shopping_agent(
        state["recipe"]
    )
    logger.info("request_id=%s ShoppingAgent completed", state["request_id"])
    return {"shopping": shopping}


# -------- Build Graph --------

workflow = StateGraph(AgentState)

workflow.add_node("PantryAgent", pantry_node)
workflow.add_node("RecipeAgent", recipe_node)
workflow.add_node("MealPlannerAgent", meal_plan_node)
workflow.add_node("ShoppingAgent", shopping_node)

workflow.set_entry_point("PantryAgent")

workflow.add_edge("PantryAgent", "RecipeAgent")
workflow.add_edge("RecipeAgent", "MealPlannerAgent")
workflow.add_edge("MealPlannerAgent", "ShoppingAgent")
workflow.add_edge("ShoppingAgent", END)

graph = workflow.compile()


# -------- Run Graph --------

def run_agents(ingredients: list[str], request_id: str = "-") -> dict[str, object]:
    logger.info("request_id=%s LangGraph invocation started", request_id)

    result = graph.invoke(
        {
            "ingredients": ingredients,
            "request_id": request_id,
        }
    )

    logger.info("request_id=%s LangGraph invocation completed", request_id)
    return {
        "pantry": result["pantry"],
        "recipe": result["recipe"],
        "meal_plan": result["meal_plan"],
        "shopping": result["shopping"]
    }
