# Backend Server

This directory contains a FastAPI backend server that provides API endpoints for the application.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   python run.py
   ```

   This will start the server on http://localhost:8000

## CORS Configuration

The server is configured to allow cross-origin requests from:
- http://localhost:3000
- http://localhost:3001
- https://localhost:3000

If you need to allow requests from additional origins, update the `origins` list in `main.py`.

## Testing CORS Headers

To test that CORS headers are properly set:

1. Make sure the server is running
2. Run the CORS tests:
   ```
   python test_cors.py
   ```

## API Endpoints

- GET /products - Get all products
- GET /products/{title} - Get a specific product
- POST /products - Create a new product
- PUT /products/{title} - Update a product
- DELETE /products/{title} - Delete a product

- GET /users/{username} - Get a specific user
- POST /users - Create a new user
- PUT /users/{username} - Update a user
- DELETE /users/{username} - Delete a user