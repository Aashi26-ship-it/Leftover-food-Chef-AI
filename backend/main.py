"""FastAPI entrypoint. Startup intentionally does not initialize AI services."""

import asyncio
import logging
import os
import time
from collections.abc import Awaitable, Callable
from contextlib import asynccontextmanager
from typing import Annotated, Any, TypeVar
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from agents.agent_controller import run_agents
from errors import GeminiConfigurationError, GeminiResponseError
from gemini_service import generate_recipe


logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)
T = TypeVar("T")
IngredientsQuery = Annotated[str, Query(description="Comma-separated ingredient names", min_length=1, max_length=1000)]


def error_response(status_code: int, code: str, message: str, request: Request) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message, "request_id": getattr(request.state, "request_id", None)}},
    )


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("application startup complete; AI services are lazy-loaded")
    yield
    logger.info("application shutdown complete")


app = FastAPI(title="Leftover Food Chef AI", version="1.0.0", lifespan=lifespan)

_default_origins = [
    "https://leftover-food-chef-cdii1yt7t-aashi26-ship-its-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
]
_cors_env = os.getenv("CORS_ORIGINS", "").strip()
allowed_origins = (
    [origin.strip() for origin in _cors_env.split(",") if origin.strip()] if _cors_env else _default_origins
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging(request: Request, call_next: Callable[[Request], Awaitable[Any]]) -> Any:
    request_id = request.headers.get("X-Request-ID", uuid4().hex)
    request.state.request_id = request_id
    started_at = time.monotonic()
    logger.info("request_id=%s request received method=%s path=%s", request_id, request.method, request.url.path)
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("request_id=%s unhandled request error path=%s", request_id, request.url.path)
        raise
    response.headers["X-Request-ID"] = request_id
    logger.info("request_id=%s response sent status=%d duration_ms=%d", request_id, response.status_code, (time.monotonic() - started_at) * 1000)
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("request_id=%s validation failed errors=%s", getattr(request.state, "request_id", "-"), exc.errors())
    return error_response(422, "validation_error", "Invalid request.", request)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    message = exc.detail if isinstance(exc.detail, str) else "Request failed."
    return error_response(exc.status_code, "request_error", message, request)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("request_id=%s unhandled exception path=%s", getattr(request.state, "request_id", "-"), request.url.path)
    return error_response(500, "internal_error", "Unexpected server error. Check server logs.", request)


def parse_ingredients(raw_ingredients: str) -> list[str]:
    ingredients: list[str] = []
    seen: set[str] = set()
    for item in raw_ingredients.split(","):
        normalized = " ".join(item.split())
        if not normalized:
            continue
        if len(normalized) > 100:
            raise HTTPException(status_code=422, detail="Each ingredient must be 100 characters or fewer.")
        if normalized.casefold() not in seen:
            seen.add(normalized.casefold())
            ingredients.append(normalized)
    if not ingredients:
        raise HTTPException(status_code=422, detail="Provide at least one non-empty ingredient.")
    if len(ingredients) > 50:
        raise HTTPException(status_code=422, detail="Provide no more than 50 ingredients.")
    return ingredients


async def execute_recipe_request(action: Callable[[], T], endpoint: str, request_id: str) -> T:
    try:
        timeout = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "35"))
        if not 1 <= timeout <= 90:
            raise ValueError
    except ValueError as exc:
        logger.exception("request_id=%s invalid REQUEST_TIMEOUT_SECONDS", request_id)
        raise HTTPException(status_code=500, detail="Server timeout configuration is invalid.") from exc
    try:
        logger.info("request_id=%s endpoint=%s workflow dispatched", request_id, endpoint)
        result = await asyncio.wait_for(run_in_threadpool(action), timeout=timeout)
        logger.info("request_id=%s endpoint=%s workflow completed", request_id, endpoint)
        return result
    except TimeoutError as exc:
        logger.error("request_id=%s endpoint=%s workflow timed out after_seconds=%.1f", request_id, endpoint, timeout)
        raise HTTPException(status_code=504, detail="Recipe generation timed out. Please try again.") from exc
    except GeminiConfigurationError as exc:
        logger.error("request_id=%s endpoint=%s Gemini configuration error=%s", request_id, endpoint, exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GeminiResponseError as exc:
        logger.warning("request_id=%s endpoint=%s Gemini request error=%s", request_id, endpoint, exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("request_id=%s endpoint=%s unexpected workflow error", request_id, endpoint)
        raise HTTPException(status_code=500, detail="Recipe generation failed unexpectedly. Check server logs.") from exc


@app.get("/")
async def home() -> dict[str, str]:
    return {"message": "Welcome to Leftover Food Chef AI"}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/recipe")
async def recipe(request: Request, ingredients: IngredientsQuery) -> dict[str, str]:
    request_id = request.state.request_id
    logger.info("request_id=%s endpoint=/recipe query parsing started", request_id)
    parsed_ingredients = parse_ingredients(ingredients)
    logger.info("request_id=%s endpoint=/recipe query parsing completed ingredient_count=%d", request_id, len(parsed_ingredients))
    result = await execute_recipe_request(lambda: generate_recipe(parsed_ingredients, request_id), "/recipe", request_id)
    logger.info("request_id=%s endpoint=/recipe JSON response ready", request_id)
    return {"recipe": result}


@app.get("/agent-recipe")
async def agent_recipe(request: Request, ingredients: IngredientsQuery) -> dict[str, object]:
    request_id = request.state.request_id
    logger.info("request_id=%s endpoint=/agent-recipe query parsing started", request_id)
    parsed_ingredients = parse_ingredients(ingredients)
    logger.info("request_id=%s endpoint=/agent-recipe query parsing completed ingredient_count=%d", request_id, len(parsed_ingredients))
    result = await execute_recipe_request(lambda: run_agents(parsed_ingredients), "/agent-recipe", request_id)
    logger.info("request_id=%s endpoint=/agent-recipe JSON response ready", request_id)
    return result
