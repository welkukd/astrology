import json
import httpx
import logging

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"


async def call_gemini(prompt: str, max_tokens: int = 8192, temperature: float = 0.4) -> str:
    """Call Gemini Flash. Raises httpx.HTTPStatusError on failure."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "topP": 0.95,
        },
    }
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(
            GEMINI_URL,
            json=payload,
            params={"key": settings.GEMINI_API_KEY},
        )
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def call_gemini_json(prompt: str, max_tokens: int = 8192) -> dict:
    """Call Gemini and parse the response as JSON.
    Strips markdown code fences if present."""
    raw = await call_gemini(prompt, max_tokens=max_tokens, temperature=0.3)
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [ln for ln in lines if not ln.startswith("```")]
        text = "\n".join(lines)
    return json.loads(text)


async def call_openrouter(prompt: str, max_tokens: int = 2000, temperature: float = 0.3) -> str:
    """Call OpenCode Zen (OpenAI-compatible) with free models.
    Handles reasoning models that put output in 'reasoning' field."""
    base = settings.OPENROUTER_BASE_URL or "https://opencode.ai/zen/v1"
    url = f"{base}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.OPENROUTER_MODEL or "mimo-v2.5-free",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    message = data["choices"][0]["message"]
    content = message.get("content")

    # Reasoning models (e.g. mimo-v2.5-free) return content=null
    # and put the actual output in the "reasoning" field
    if not content:
        reasoning = message.get("reasoning")
        if reasoning:
            logger.info("OpenRouter returned reasoning-only response, using reasoning field")
            content = reasoning
        else:
            # Last resort: stringify the whole response
            logger.warning("OpenRouter returned empty content and no reasoning")
            raise ValueError("AI returned empty response — no content or reasoning field")

    # Reasoning models may return double-escaped strings (\\n, \\, \")
    # Detect and unescape them with a targeted approach that preserves
    # non-ASCII characters (Malayalam, Hindi, etc.) unlike .encode().decode('unicode_escape')
    if content and '\\n' in content[:100]:
        import re as _re
        _ESCAPE_RE = _re.compile(r'\\\\|\\n|\\t|\\r|\\"|\\u([0-9a-fA-F]{4})')
        _ESCAPE_MAP = {'\\\\': '\\', '\\n': '\n', '\\t': '\t', '\\r': '\r', '\\"': '"'}
        def _unescape(m):
            if m.group(1):
                return chr(int(m.group(1), 16))
            return _ESCAPE_MAP.get(m.group(0), m.group(0))
        try:
            content = _ESCAPE_RE.sub(_unescape, content)
        except Exception:
            pass  # Not double-escaped, keep as-is

    return content


async def call_ai(prompt: str, max_tokens: int = 8192, temperature: float = 0.4) -> str:
    """Route to the configured AI provider (AI_PROVIDER env var)."""
    provider = settings.AI_PROVIDER or "gemini"
    if provider == "openrouter":
        return await call_openrouter(prompt, max_tokens=max_tokens, temperature=temperature)
    return await call_gemini(prompt, max_tokens=max_tokens, temperature=temperature)


async def call_ai_json(prompt: str, max_tokens: int = 8192) -> dict:
    """Call the configured AI provider and parse JSON response."""
    raw = await call_ai(prompt, max_tokens=max_tokens, temperature=0.3)
    text = raw.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [ln for ln in lines if not ln.startswith("```")]
        text = "\n".join(lines)
    return json.loads(text)
