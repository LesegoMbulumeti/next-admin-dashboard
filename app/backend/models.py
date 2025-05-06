from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = 'admin'
    USER = 'user'

class UserStatus(str, Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'

# Base model shared between models
class UserBase(BaseModel):
    username: str
    email: EmailStr
    img: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Model for creating users (what you expect to receive from API)
class UserCreate(UserBase):
    cognito_sub: str
    role: UserRole = UserRole.USER
    status: UserStatus = UserStatus.ACTIVE

# Model for updating users (all fields optional)
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    img: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    
    
# Complete user model (what gets returned from database)
class User(UserBase):
    user_id: str
    cognito_sub: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime

# Product models
class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    stock: int
    category_id: int
    img: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None
    img: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None

class Product(ProductBase):
    prod_id: str
    created_at: datetime
    updated_at: datetime

class ProductCategory(BaseModel):
    category_id: int
    name: str
    description: str