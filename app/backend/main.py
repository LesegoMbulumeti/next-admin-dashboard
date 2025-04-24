
from fastapi import FastAPI, HTTPException
from models import User, Product
import boto3
from boto3.dynamodb.conditions import Key
import os
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)
users_table = dynamodb.Table("Users")
products_table = dynamodb.Table("Products")


#endpoints
@app.post("/users")
def create_user(user: User):
    users_table.put_item(Item=user.dict())
    return {"message": "User created successfully"}

@app.get("/users/{username}")
def get_user(username: str):
    response = users_table.get_item(Key={"username": username})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="User not found")
    return response["Item"]

@app.put("/users/{username}")
def update_user(username: str, updated_user: User):
    response = users_table.get_item(Key={"username": username})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="User not found")

    users_table.put_item(Item=updated_user.dict())
    return {"message": "User updated successfully"}

@app.delete("/users/{username}")
def delete_user(username: str):
    response = users_table.get_item(Key={"username": username})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="User not found")

    users_table.delete_item(Key={"username": username})
    return {"message": "User deleted successfully"}



@app.post("/products")
def create_product(product: Product):
    products_table.put_item(Item=product.dict())
    return {"message": "Product created successfully"}

@app.get("/products/{title}")
def get_product(title: str):
    response = products_table.get_item(Key={"title": title})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Product not found")
    return response["Item"]

@app.put("/products/{title}")
def update_product(title: str, updated_product: Product):
    response = products_table.get_item(Key={"title": title})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Product not found")

    products_table.put_item(Item=updated_product.dict())
    return {"message": "Product updated successfully"}

@app.delete("/products/{title}")
def delete_product(title: str):
    response = products_table.get_item(Key={"title": title})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Product not found")

    products_table.delete_item(Key={"title": title})
    return {"message": "Product deleted successfully"}
