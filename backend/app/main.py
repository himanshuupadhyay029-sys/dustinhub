import os
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from .database import Base, engine
from .routes.auth_routes import router as auth_router, limiter
from .routes.movie_routes import router as movie_router
from .routes.admin_routes import router as admin_router

app = FastAPI(
    title="Movie Catalog API",
    description="Backend API for the Movie Catalog discovery platform",
    version="1.0.0"
)

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
origins = [
    "http://localhost:5173",      # Default Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(movie_router)
app.include_router(admin_router)

@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["System Health"])
def health_check():
    """
    Health check endpoint to ensure API service is reachable.
    """
    return {"status": "healthy", "service": "Movie Catalog API"}

# Auto-create tables (Alembic is preferred, but this ensures a smooth local setup)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database connection error or table creation skipped: {e}")
