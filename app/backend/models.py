from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    email: str
    password: str
    img: Optional[str] = None
    isAdmin: bool = False
    isActive: bool = True
    phone: Optional[str] = None
    address: Optional[str] = None

class Product(BaseModel):
    title: str
    desc: str
    price: float
    stock: int
    img: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None
