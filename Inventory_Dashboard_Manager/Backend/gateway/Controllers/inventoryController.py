from fastapi import APIRouter, Header
from Models.schemas import InventoryItemCreate, InventoryItemUpdate
import httpx

router = APIRouter(prefix="/api/inventory")

SPRING_URL = "http://localhost:8083/"


@router.get("")
async def get_all_inventory(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/inventory",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/search")
async def search_inventory(query: str, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/inventory/search",
            params={"query": query},
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/low-stock")
async def get_low_stock(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/inventory/low-stock",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/category/{category}")
async def get_by_category(category: str, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_URL}api/inventory/category/{category}",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/{item_id}")
async def get_inventory_item(item_id: int, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_URL}api/inventory/{item_id}",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.post("")
async def create_inventory_item(I: InventoryItemCreate, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "api/inventory",
            json=I.model_dump(),
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.put("/{item_id}")
async def update_inventory_item(item_id: int, I: InventoryItemUpdate, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{SPRING_URL}api/inventory/{item_id}",
            json=I.model_dump(exclude_none=True),
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.delete("/{item_id}")
async def delete_inventory_item(item_id: int, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{SPRING_URL}api/inventory/{item_id}",
            headers={"Authorization": Authorization}
        )

    return response.json()
