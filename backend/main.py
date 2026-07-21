import asyncio
import logging
import os
from uuid import uuid4
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
REQUEST_TIMEOUT_SECONDS = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "35"))


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


async def execute_recipe_request(action: Callable[[], T], endpoint: str, request_id: str) -> T:
    try:
        logger.info("request_id=%s endpoint=%s dispatching workflow to worker", request_id, endpoint)
        result = await asyncio.wait_for(run_in_threadpool(action), timeout=REQUEST_TIMEOUT_SECONDS)
        logger.info("request_id=%s endpoint=%s workflow completed", request_id, endpoint)
        return result
    except TimeoutError as exc:
        logger.error("request_id=%s endpoint=%s workflow timed out after %.1fs", request_id, endpoint, REQUEST_TIMEOUT_SECONDS)
        raise HTTPException(status_code=504, detail="Recipe generation timed out. Please try again.") from exc
    except HTTPException:
        raise
    except GeminiConfigurationError as exc:
        logger.error("request_id=%s endpoint=%s Gemini is not configured", request_id, endpoint)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GeminiResponseError as exc:
        logger.warning("request_id=%s endpoint=%s Gemini request failed: %s", request_id, endpoint, exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("request_id=%s unexpected error in %s", request_id, endpoint)
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
    request_id = uuid4().hex
    logger.info("request_id=%s endpoint=/recipe request received", request_id)
    logger.info("request_id=%s endpoint=/recipe query parsing started", request_id)
    parsed_ingredients = parse_ingredients(ingredients)
    logger.info("request_id=%s endpoint=/recipe query parsing completed ingredient_count=%d", request_id, len(parsed_ingredients))
    result = await execute_recipe_request(lambda: generate_recipe(parsed_ingredients, request_id), "/recipe", request_id)
    logger.info("request_id=%s endpoint=/recipe JSON response ready", request_id)
    return {"recipe": result}


@app.get("/agent-recipe")
async def agent_recipe(ingredients: IngredientsQuery) -> dict[str, object]:
    request_id = uuid4().hex
    logger.info("request_id=%s endpoint=/agent-recipe request received", request_id)
    logger.info("request_id=%s endpoint=/agent-recipe query parsing started", request_id)
    parsed_ingredients = parse_ingredients(ingredients)
    logger.info("request_id=%s endpoint=/agent-recipe query parsing completed ingredient_count=%d", request_id, len(parsed_ingredients))
    result = await execute_recipe_request(lambda: run_agents(parsed_ingredients, request_id), "/agent-recipe", request_id)
    logger.info("request_id=%s endpoint=/agent-recipe JSON response ready", request_id)
    return result
