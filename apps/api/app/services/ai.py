import httpx
from app.core.config import settings


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
    import json
    return json.loads(text)
