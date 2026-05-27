from fastapi import APIRouter, Header, Query
import httpx

router = APIRouter(prefix="/api/analytics")

SPRING_URL = "http://localhost:8083/"


@router.get("/dashboard")
async def get_dashboard_metrics(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/dashboard",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/categories")
async def get_category_analytics(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/categories",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/stock-alerts")
async def get_stock_alerts(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/stock-alerts",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/inventory-summary")
async def get_inventory_summary(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/inventory-summary",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/low-stock")
async def get_low_stock_items(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/low-stock",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/sales-metrics")
async def get_sales_metrics(days: int = Query(7), Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/sales-metrics",
            params={"days": days},
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/top-selling-items")
async def get_top_selling_items(limit: int = Query(5), Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/top-selling-items",
            params={"limit": limit},
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/category/{category_name}")
async def get_inventory_by_category(category_name: str, Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_URL}api/analytics/category/{category_name}",
            headers={"Authorization": Authorization}
        )

    return response.json()


@router.get("/turnover-metrics")
async def get_turnover_metrics(Authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "api/analytics/turnover-metrics",
            headers={"Authorization": Authorization}
        )

    return response.json()
