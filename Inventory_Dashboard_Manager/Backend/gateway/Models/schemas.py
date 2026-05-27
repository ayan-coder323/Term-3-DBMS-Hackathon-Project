from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    role: str
    isActive: int



class InventoryItemCreate(BaseModel):
    name: str
    description: str = ""
    quantity: int
    price: float
    category: str
    sku: str
    reorderLevel: int = 10


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    reorderLevel: Optional[int] = None
