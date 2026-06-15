from fastapi import APIRouter, Header, Query
from fastapi.responses import JSONResponse
from Models.schemas import UserUpdate
import httpx

router = APIRouter(prefix="/api/users")

SPRING_URL = "http://localhost:8083/"


@router.get("")
async def get_all_users(
    page: int = Query(0),
    size: int = Query(5),
    Authorization: str = Header(...)
):
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            SPRING_URL + "api/users",
            params={"page": page, "size": size},
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/emails")
async def get_all_user_emails(
    Authorization: str = Header(...)
):
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            SPRING_URL + "api/users/emails",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    U: UserUpdate,
    Authorization: str = Header(...)
):
    payload = U.model_dump()
    print(f"[Gateway] PUT /api/users/{user_id} payload: {payload}")
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.put(
            f"{SPRING_URL}api/users/{user_id}",
            json=payload,
            headers={
                "Authorization": Authorization,
                "Content-Type": "application/json"
            }
        )

    print(f"[Gateway] Spring responded {response.status_code}: {response.text}")
    if response.status_code >= 400:
        return JSONResponse(status_code=response.status_code, content=response.json())
    return response.json()


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    Authorization: str = Header(...)
):
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.delete(
            f"{SPRING_URL}api/users/{user_id}",
            headers={"Authorization": Authorization}
        )

    if response.status_code >= 400:
        return JSONResponse(status_code=response.status_code, content=response.json())
    return response.json()

