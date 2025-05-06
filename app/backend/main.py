from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import User, Product, UserCreate, UserUpdate, ProductCreate, ProductUpdate
from datetime import datetime
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import List
import uuid
from sqlalchemy import Row

def row_to_dict(row: Row) -> dict:
    """Convert SQLAlchemy Row object to dictionary"""
    return {key: getattr(row, key) for key in row._fields}

load_dotenv()

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Type"],
    max_age=600,
)

# PostgreSQL connection
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Admin Dashboard API",
        "endpoints": {
            "users": "/users",
            "products": "/products"
        }
    }

# User Endpoints
@app.get("/users", response_model=List[User])
async def get_all_users():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM users"))
        return [row_to_dict(user) for user in result]

@app.get("/users/{username}", response_model=User)
async def get_user(username: str):
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM users WHERE username = :username"),
            {"username": username}
        )
        user = result.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return row_to_dict(user)

@app.post("/users", response_model=User)
async def create_user(user: UserCreate):
    with engine.connect() as connection:
        # Check if username or email already exists
        exists = connection.execute(
            text("SELECT 1 FROM users WHERE username = :username OR email = :email"),
            {"username": user.username, "email": user.email}
        ).fetchone()
        
        if exists:
            raise HTTPException(status_code=400, detail="Username or email already exists")
        
        # Insert new user
        result = connection.execute(
            text("""
                INSERT INTO users 
                (user_id, cognito_sub, username, email, img, role, status, phone, address)
                VALUES 
                (gen_random_uuid()::text, :cognito_sub, :username, :email, :img, :role, :status, :phone, :address)
                RETURNING *
            """),
            user.dict()
        )
        new_user = result.fetchone()
        connection.commit()
        
        return row_to_dict(new_user)

@app.put("/users/{username}", response_model=User)
async def update_user(username: str, user_update: UserUpdate):
    with engine.connect() as connection:
        # Check if user exists
        existing = connection.execute(
            text("SELECT 1 FROM users WHERE username = :username"),
            {"username": username}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update query
        update_data = user_update.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        
        set_clause = ", ".join([f"{key} = :{key}" for key in update_data.keys()])
        
        result = connection.execute(
            text(f"""
                UPDATE users 
                SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                WHERE username = :username
                RETURNING *
            """),
            {"username": username, **update_data}
        )
        updated_user = result.fetchone()
        connection.commit()
        
        return row_to_dict(updated_user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    with engine.connect() as connection:
        # Check if user exists
        existing = connection.execute(
            text("SELECT 1 FROM users WHERE user_id = :user_id"),
            {"user_id": user_id}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete and return success message
        connection.execute(
            text("DELETE FROM users WHERE user_id = :user_id"),
            {"user_id": user_id}
        )
        connection.commit()
        
        return {"message": "User deleted successfully"}


# Product Endpoints
@app.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    with engine.connect() as connection:
        # Check if category exists
        category = connection.execute(
            text("SELECT 1 FROM product_categories WHERE category_id = :category_id"),
            {"category_id": product.category_id}
        ).fetchone()
        
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category_id")
        
        # Generate a UUID for the product ID
        prod_id = str(uuid.uuid4())
        
        # Insert product with generated ID
        result = connection.execute(
            text("""
                INSERT INTO products 
                (prod_id, title, description, price, stock, category_id, img, color, size)
                VALUES 
                (:prod_id, :title, :description, :price, :stock, :category_id, :img, :color, :size)
                RETURNING *
            """),
            {
                "prod_id": prod_id,
                "title": product.title,
                "description": product.description,
                "price": product.price,
                "stock": product.stock,
                "category_id": product.category_id,
                "img": None,  # Can be modified if handling images
                "color": product.color,
                "size": product.size
            }
        )
        new_product = result.fetchone()
        connection.commit()
        
        # Convert Row object to dict
        return dict(zip(new_product._fields, new_product._data))

@app.get("/products", response_model=List[Product])
async def get_all_products():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM products"))
        products = result.fetchall()
        return [row_to_dict(product) for product in products]

@app.get("/products/{prod_id}", response_model=Product)
async def get_product(prod_id: str):
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM products WHERE prod_id = :prod_id"),
            {"prod_id": prod_id}
        )
        product = result.fetchone()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return row_to_dict(product)

@app.put("/products/{prod_id}", response_model=Product)
async def update_product(prod_id: str, product_update: ProductUpdate):
    with engine.connect() as connection:
        # Check if product exists
        existing = connection.execute(
            text("SELECT 1 FROM products WHERE prod_id = :prod_id"),
            {"prod_id": prod_id}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if category exists if being updated
        if product_update.category_id is not None:
            category = connection.execute(
                text("SELECT 1 FROM product_categories WHERE category_id = :category_id"),
                {"category_id": product_update.category_id}
            ).fetchone()
            
            if not category:
                raise HTTPException(status_code=400, detail="Invalid category_id")
        
        # Build update query
        update_data = product_update.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        
        set_clause = ", ".join([f"{key} = :{key}" for key in update_data.keys()])
        
        result = connection.execute(
            text(f"""
                UPDATE products 
                SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                WHERE prod_id = :prod_id
                RETURNING *
            """),
            {"prod_id": prod_id, **update_data}
        )
        updated_product = result.fetchone()
        connection.commit()
        
        return dict(updated_product)

@app.delete("/products/{prod_id}")
async def delete_product(prod_id: str):
    with engine.connect() as connection:
        # Check if product exists
        existing = connection.execute(
            text("SELECT 1 FROM products WHERE prod_id = :prod_id"),
            {"prod_id": prod_id}
        ).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        connection.execute(
            text("DELETE FROM products WHERE prod_id = :prod_id"),
            {"prod_id": prod_id}
        )
        connection.commit()
        
        return {"message": "Product deleted successfully"}