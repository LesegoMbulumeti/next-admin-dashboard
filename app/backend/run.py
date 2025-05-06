import uvicorn

if __name__ == "__main__":
    # Run the FastAPI application with uvicorn
    # host="0.0.0.0" makes the server accessible from other machines/containers
    # port=8000 specifies the port to run on
    # reload=True enables auto-reloading when code changes
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)