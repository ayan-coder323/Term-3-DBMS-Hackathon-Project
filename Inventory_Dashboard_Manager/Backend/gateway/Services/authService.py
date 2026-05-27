from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

from config import settings

# JWT Configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication and JWT token management"""

    @staticmethod
    def _truncate_password(password: str) -> str:
        """
        Truncate password safely to bcrypt's 72-byte limit
        """
        password_bytes = password.encode("utf-8")[:72]
        return password_bytes.decode("utf-8", errors="ignore")

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password for storing"""
        password = AuthService._truncate_password(password)
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash"""
        plain_password = AuthService._truncate_password(plain_password)
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token"""

        to_encode = data.copy()

        expire = (
            datetime.now(timezone.utc) + expires_delta
            if expires_delta
            else datetime.now(timezone.utc)
            + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc)
        })

        encoded_jwt = jwt.encode(
            to_encode,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return encoded_jwt

    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verify and decode a JWT token"""

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=["HS256", "HS384", "HS512"]
            )
            return payload

        except JWTError:
            return None

    @staticmethod
    def decode_token(token: str) -> Optional[str]:
        """Decode token and extract user email/username"""

        payload = AuthService.verify_token(token)

        if payload:
            return payload.get("sub")

        return None

    @staticmethod
    def get_user_from_token(token: str) -> Optional[dict]:
        """Extract user information from token"""

        payload = AuthService.verify_token(token)

        if payload:
            return {
                "email": payload.get("sub"),
                "user_id": payload.get("user_id"),
                "role": payload.get("role")
            }

        return None

    @staticmethod
    async def proxy_register(user_data: dict) -> dict:
        """Forward registration request to Spring Boot"""
        import httpx
        from fastapi import HTTPException
        from config import settings
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{settings.SPRING_BOOT_URL}/api/auth/register",
                    json=user_data
                )
                if response.status_code not in (200, 201):
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error during registration")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def proxy_login(credentials: dict) -> dict:
        """Forward login request to Spring Boot"""
        import httpx
        from fastapi import HTTPException
        from config import settings
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{settings.SPRING_BOOT_URL}/api/auth/login",
                    json=credentials
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Invalid credentials")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def proxy_get_me(token: str) -> dict:
        """Forward current user request to Spring Boot"""
        import httpx
        from fastapi import HTTPException
        from config import settings
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/auth/me",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Could not fetch current user")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def proxy_refresh_token(token: str) -> dict:
        """Forward token refresh request to Spring Boot"""
        import httpx
        from fastapi import HTTPException
        from config import settings
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{settings.SPRING_BOOT_URL}/api/auth/refresh-token",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Could not refresh token")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")