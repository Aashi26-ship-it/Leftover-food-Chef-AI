"""Small, defensive boundary around the Gemini SDK."""

import json
import logging
import os
import re
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

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


class GeminiConfigurationError(Exception):
    """Gemini cannot be called because the service is not configured."""


class GeminiResponseError(Exception):
    """Gemini returned a response that cannot safely be used."""


def _get_client() -> genai.Client:
    """Create the SDK client only when a request needs it.

    Importing this module must not crash a Railway instance when an environment
    variable is absent; the API can then return a useful 503 instead.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise GeminiConfigurationError("GEMINI_API_KEY is not configured.")
    return genai.Client(api_key=api_key)


def _extract_json(text: str) -> dict[str, Any]:
    """Parse JSON even if a provider unexpectedly wraps it in a code fence."""
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
    result = [item.strip() for item in value if isinstance(item, str) and item.strip()]
    if not result:
        raise GeminiResponseError(f"The AI response has an empty '{field_name}' field.")
    return result


def _format_recipe(payload: dict[str, Any]) -> str:
    name = payload.get("name")
    cooking_time = payload.get("cooking_time")
    if not isinstance(name, str) or not name.strip():
        raise GeminiResponseError("The AI response has an invalid 'name' field.")
    if not isinstance(cooking_time, str) or not cooking_time.strip():
        raise GeminiResponseError("The AI response has an invalid 'cooking_time' field.")

    ingredients = _as_string_list(payload.get("ingredients"), "ingredients")
    steps = _as_string_list(payload.get("steps"), "steps")
    return "\n".join(
        [
            name.strip(),
            f"Cooking time: {cooking_time.strip()}",
            "Ingredients:",
            *[f"- {item}" for item in ingredients],
            "Steps:",
            *[f"{index}. {step}" for index, step in enumerate(steps, start=1)],
        ]
    )


def generate_recipe(ingredients: list[str]) -> str:
    """Generate a display-ready recipe from a validated ingredient list."""
    prompt = (
        "Create one practical, easy recipe using as many of these ingredients as possible: "
        f"{', '.join(ingredients)}. "
        "Return only JSON matching the requested schema. Do not invent unsafe cooking advice."
    )
    try:
        # Keep the client strongly referenced until the request completes. The
        # SDK owns an HTTP client and can otherwise be finalized too early.
        client = _get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RECIPE_SCHEMA,
                temperature=0.4,
            ),
        )
        text = response.text
    except GeminiConfigurationError:
        raise
    except Exception as exc:
        logger.exception("Gemini generation failed", extra={"model": GEMINI_MODEL})
        raise GeminiResponseError("The AI recipe service is unavailable.") from exc

    if not text or not text.strip():
        raise GeminiResponseError("The AI recipe service returned an empty response.")
    return _format_recipe(_extract_json(text))
