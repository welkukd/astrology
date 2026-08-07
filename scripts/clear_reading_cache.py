#!/usr/bin/env python3
"""Delete cached readings for all charts so they regenerate with fixed parsing."""
import httpx

SUPABASE_URL = "https://pefvkvpcsxuanhctuoms.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZnZrdnBjc3h1YW5oY3R1b21zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQ4ODQ5NSwiZXhwIjoyMDcwMDY0NDk1fQ.VCJ9"

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

# Delete ALL cached readings (old format)
resp = httpx.delete(
    f"{SUPABASE_URL}/rest/v1/interpretations",
    headers=headers,
    params={"type": "eq.full_v2"},
)
print(f"Delete full_v2 readings: status={resp.status_code}, body={resp.text[:200]}")

# Also delete any other cached types
resp2 = httpx.delete(
    f"{SUPABASE_URL}/rest/v1/interpretations",
    headers=headers,
    params={"type": "neq.full_v2"},
)
print(f"Delete other readings: status={resp2.status_code}, body={resp2.text[:200]}")
