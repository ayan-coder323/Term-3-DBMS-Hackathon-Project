from fastapi import APIRouter, Header, Response
from Models.schemas import UserCreate, UserLogin
import httpx

router = APIRouter(prefix="/api/auth")

SPRING_URL = "http://localhost:8083/"


@router.post("/register")
async def register(U: UserCreate, response: Response):
    async with httpx.AsyncClient() as client:
        upstream_response = await client.post(
            SPRING_URL + "api/auth/register",
            json=U.model_dump()
        )

    response.status_code = upstream_response.status_code
    return upstream_response.json()


@router.post("/login")
async def login(U: UserLogin, response: Response):
    async with httpx.AsyncClient() as client:
        upstream_response = await client.post(
            SPRING_URL + "api/auth/login",
            json=U.model_dump()
        )

    response.status_code = upstream_response.status_code
    return upstream_response.json()


@router.get("/me")
async def get_me(response: Response, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        upstream_response = await client.get(
            SPRING_URL + "api/auth/me",
            headers={"Authorization": Authorization}
        )

    response.status_code = upstream_response.status_code
    return upstream_response.json()


@router.post("/refresh-token")
async def refresh_token(response: Response, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        upstream_response = await client.post(
            SPRING_URL + "api/auth/refresh-token",
            headers={"Authorization": Authorization}
        )

    response.status_code = upstream_response.status_code
    return upstream_response.json()


@router.get("/verify-token")
async def verify_token(response: Response, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        upstream_response = await client.get(
            SPRING_URL + "api/auth/verify-token",
            headers={"Authorization": Authorization}
        )

    response.status_code = upstream_response.status_code
    return upstream_response.json()
