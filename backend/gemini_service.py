"""Lazy, bounded Gemini integration used only by recipe requests."""

import json
import logging
import os
import re
from typing import Any

from errors import GeminiConfigurationError, GeminiResponseError

logger = logging.getLogger(__name__)

RECIPE_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "ingredients": {"type": "array", "items": {"type": "string"}},
        "steps": {"type": "array", "items": {"type": "string"}},
        "cooking_time": {"type": "string"},
    },
    "required": ["name", "ingredients", "steps", "cooking_time"],
}


def _settings() -> tuple[str, str, int]:
    """Read settings on demand so missing AI settings cannot break startup."""
    try:
        from dotenv import load_dotenv

        load_dotenv(override=False)
    except Exception:
        logger.warning("Unable to load local .env file; using process environment", exc_info=True)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    try:
        timeout_ms = int(os.getenv("GEMINI_TIMEOUT_MS", "25000"))
    except ValueError as exc:
        raise GeminiConfigurationError("GEMINI_TIMEOUT_MS must be an integer in milliseconds.") from exc
    if not api_key or api_key == "your_gemini_api_key_here":
        raise GeminiConfigurationError("GEMINI_API_KEY is not configured.")
    if not model:
        raise GeminiConfigurationError("GEMINI_MODEL must not be empty.")
    if not 1_000 <= timeout_ms <= 60_000:
        raise GeminiConfigurationError("GEMINI_TIMEOUT_MS must be between 1000 and 60000.")
    return api_key, model, timeout_ms


def _get_client(request_id: str) -> tuple[Any, str]:
    """Import and initialize the SDK only after a recipe request is received."""
    logger.info("request_id=%s Gemini client initialization started", request_id)
    api_key, model, timeout_ms = _settings()
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                timeout=timeout_ms,
                retry_options=types.HttpRetryOptions(attempts=1),
            ),
        )
    except Exception as exc:
        logger.exception("request_id=%s Gemini client initialization failed", request_id)
        raise GeminiConfigurationError("Gemini client initialization failed. Check GEMINI_API_KEY and SDK installation.") from exc
    logger.info("request_id=%s Gemini client initialization completed", request_id)
    return client, model


def _extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned, flags=re.IGNORECASE)
    candidates = [cleaned]
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start != -1 and end > start:
        candidates.append(cleaned[start : end + 1])
    for candidate in candidates:
        try:
            value = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict):
            return value
    raise GeminiResponseError("The AI response was not valid recipe JSON.")


def _as_string_list(value: Any, field_name: str) -> list[str]:
    if not isinstance(value, list):
        raise GeminiResponseError(f"The AI response has an invalid '{field_name}' field.")
    items = [item.strip() for item in value if isinstance(item, str) and item.strip()]
    if not items:
        raise GeminiResponseError(f"The AI response has an empty '{field_name}' field.")
    return items


def _format_recipe(payload: dict[str, Any]) -> str:
    name, cooking_time = payload.get("name"), payload.get("cooking_time")
    if not isinstance(name, str) or not name.strip():
        raise GeminiResponseError("The AI response has an invalid 'name' field.")
    if not isinstance(cooking_time, str) or not cooking_time.strip():
        raise GeminiResponseError("The AI response has an invalid 'cooking_time' field.")
    ingredients = _as_string_list(payload.get("ingredients"), "ingredients")
    steps = _as_string_list(payload.get("steps"), "steps")
    return "\n".join([
        name.strip(), f"Cooking time: {cooking_time.strip()}", "Ingredients:",
        *[f"- {item}" for item in ingredients], "Steps:",
        *[f"{number}. {step}" for number, step in enumerate(steps, start=1)],
    ])


def generate_recipe(ingredients: list[str], request_id: str = "-") -> str:
    logger.info("request_id=%s Gemini prompt creation started", request_id)
    prompt = (
        "Create one practical, easy recipe using as many of these ingredients as possible: "
        f"{', '.join(ingredients)}. Return only JSON matching the requested schema."
    )
    logger.info("request_id=%s Gemini prompt creation completed", request_id)
    client, model = _get_client(request_id)
    try:
        from google.genai import types

        logger.info("request_id=%s Gemini API call started model=%s", request_id, model)
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RECIPE_SCHEMA,
                temperature=0.4,
            ),
        )
        logger.info("request_id=%s Gemini API call completed", request_id)
        text = response.text
    except Exception as exc:
        logger.exception("request_id=%s Gemini API call failed model=%s", request_id, model)
        raise GeminiResponseError("The AI recipe service is unavailable.") from exc
    finally:
        close = getattr(client, "close", None)
        if callable(close):
            try:
                close()
            except Exception:
                logger.warning("request_id=%s Gemini client close failed", request_id, exc_info=True)

    logger.info("request_id=%s Gemini response parsing started", request_id)
    if not text or not text.strip():
        raise GeminiResponseError("The AI recipe service returned an empty response.")
    recipe = _format_recipe(_extract_json(text))
    logger.info("request_id=%s Gemini response parsing completed", request_id)
    return recipe
