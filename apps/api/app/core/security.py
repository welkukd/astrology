import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security = HTTPBearer(auto_error=False)

_supabase_url: str = ""
_supabase_jwt_secret: str = ""


def _get_jwt_secret() -> str:
    global _supabase_jwt_secret
    if not _supabase_jwt_secret:
        _supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "")
    return _supabase_jwt_secret


def _verify_jwt_local(token: str) -> Optional[str]:
    jwt_secret = _get_jwt_secret()
    if not jwt_secret:
        return None
    try:
        from jose import jwt as jose_jwt, JWTError
        payload = jose_jwt.decode(token, jwt_secret, algorithms=["HS256"], audience="authenticated")
        return payload.get("sub")
    except (JWTError, Exception):
        return None


def _verify_jwt_supabase(token: str) -> Optional[str]:
    try:
        from app.core.database import get_supabase_client
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        return user.user.id
    except Exception:
        return None


def _verify_token(token: str) -> Optional[str]:
    user_id = _verify_jwt_local(token)
    if user_id:
        return user_id
    return _verify_jwt_supabase(token)


async def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> str:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = _verify_token(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id


async def get_optional_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[str]:
    if not credentials:
        return None
    return _verify_token(credentials.credentials)