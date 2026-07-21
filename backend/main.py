import logging
import os
from collections.abc import Callable
from typing import Annotated, TypeVar

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from agents.agent_controller import run_agents
from gemini_service import GeminiConfigurationError, GeminiResponseError, generate_recipe

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Leftover Food Chef AI", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # A wildcard origin cannot be used with browser credentials. This API does
    # not use cookie authentication; set explicit CORS_ORIGINS before enabling it.
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

IngredientsQuery = Annotated[str, Query(description="Comma-separated ingredient names", min_length=1, max_length=1000)]
T = TypeVar("T")


def parse_ingredients(raw_ingredients: str) -> list[str]:
    ingredients: list[str] = []
    seen: set[str] = set()
    for item in raw_ingredients.split(","):
        normalized = " ".join(item.split()).strip()
        if not normalized:
            continue
        if len(normalized) > 100:
            raise HTTPException(status_code=422, detail="Each ingredient must be 100 characters or fewer.")
        key = normalized.casefold()
        if key not in seen:
            seen.add(key)
            ingredients.append(normalized)

    if not ingredients:
        raise HTTPException(status_code=422, detail="Provide at least one non-empty ingredient.")
    if len(ingredients) > 50:
        raise HTTPException(status_code=422, detail="Provide no more than 50 ingredients.")
    return ingredients


async def execute_recipe_request(action: Callable[[], T], endpoint: str) -> T:
    try:
        return await run_in_threadpool(action)
    except HTTPException:
        raise
    except GeminiConfigurationError as exc:
        logger.error("%s failed: Gemini is not configured", endpoint)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GeminiResponseError as exc:
        logger.warning("%s failed: %s", endpoint, exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error in %s", endpoint)
        raise HTTPException(status_code=500, detail="Recipe generation failed unexpectedly. Check server logs.") from exc


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": "Invalid request.", "errors": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error for %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Unexpected server error. Check server logs."})


@app.get("/")
async def home() -> dict[str, str]:
    return {"message": "Welcome to Leftover Food Chef AI"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/recipe")
async def recipe(ingredients: IngredientsQuery) -> dict[str, str]:
    parsed_ingredients = parse_ingredients(ingredients)
    result = await execute_recipe_request(lambda: generate_recipe(parsed_ingredients), "/recipe")
    return {"recipe": result}


@app.get("/agent-recipe")
async def agent_recipe(ingredients: IngredientsQuery) -> dict[str, object]:
    parsed_ingredients = parse_ingredients(ingredients)
    return await execute_recipe_request(lambda: run_agents(parsed_ingredients), "/agent-recipe")
