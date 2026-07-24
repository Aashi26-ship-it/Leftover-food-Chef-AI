"""Application-specific errors that are safe to import during startup."""


class GeminiConfigurationError(Exception):
    """The Gemini integration is unavailable because configuration is invalid."""


class GeminiResponseError(Exception):
    """The Gemini API could not return a usable recipe response."""
