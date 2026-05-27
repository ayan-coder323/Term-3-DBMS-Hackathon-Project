from typing import List, Dict, Optional
from Models.schemas import (
    DashboardMetrics,
    CategoryAnalytics,
    StockAlert,
    SalesMetrics
)
from config import settings
import httpx
from fastapi import HTTPException

class AnalyticsService:
    """Service for inventory analytics and dashboard metrics (proxied to Spring Boot)"""

    @staticmethod
    async def get_dashboard_metrics(token: str) -> DashboardMetrics:
        """Get overall dashboard metrics"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/dashboard",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching dashboard metrics")
                    )
                data = response.json()["data"]
                return DashboardMetrics(**data)
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_category_analytics(token: str) -> List[CategoryAnalytics]:
        """Get analytics by category"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/categories",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching category analytics")
                    )
                data_list = response.json()["data"]
                return [CategoryAnalytics(**item) for item in data_list]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_stock_alerts(token: str) -> List[StockAlert]:
        """Get stock alerts for items below reorder level"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/stock-alerts",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching stock alerts")
                    )
                data_list = response.json()["data"]
                return [StockAlert(**item) for item in data_list]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_inventory_summary(token: str) -> Dict:
        """Get complete inventory summary"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/inventory-summary",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching inventory summary")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_low_stock_items(token: str) -> List[Dict]:
        """Get items below reorder level"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/low-stock",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching low stock items")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_sales_metrics(token: str, days: int = 7) -> List[SalesMetrics]:
        """Get sales metrics for the last N days"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/sales-metrics",
                    params={"days": days},
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching sales metrics")
                    )
                data_list = response.json()["data"]
                return [SalesMetrics(**item) for item in data_list]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_top_selling_items(token: str, limit: int = 5) -> List[Dict]:
        """Get top selling items by revenue"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/top-selling-items",
                    params={"limit": limit},
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching top selling items")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def get_inventory_by_category(token: str, category: str) -> List[Dict]:
        """Get inventory items for a specific category"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/category/{category}",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", f"Error fetching category: {category}")
                    )
                # Spring Boot returns category name, list of items, and count. We just need the items.
                data = response.json()["data"]
                return data.get("items", [])
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")

    @staticmethod
    async def calculate_turnover_metrics(token: str) -> Dict:
        """Calculate inventory turnover metrics"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{settings.SPRING_BOOT_URL}/api/analytics/turnover-metrics",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=response.json().get("message", "Error fetching turnover metrics")
                    )
                return response.json()["data"]
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Core service unavailable: {str(exc)}")
