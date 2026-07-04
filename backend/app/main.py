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

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins.extend([origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()])
    allow_credentials = True
else:
    # Default to allow all for easy deployment since we use Bearer Tokens (no cookies)
    origins = ["*"]
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
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

# Programmatically run Alembic migrations on startup to keep tables up-to-date
try:
    from alembic.config import Config
    from alembic import command
    from sqlalchemy import inspect
    
    # Locate alembic.ini relative to this file
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ini_path = os.path.join(base_dir, "alembic.ini")
    
    # Set the configuration path
    alembic_cfg = Config(ini_path)
    # Ensure alembic script directory is found correctly
    alembic_cfg.set_main_option("script_location", os.path.join(base_dir, "alembic"))
    
    # Check if database already has tables created via create_all
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if "movies" in tables and "alembic_version" not in tables:
        print("Existing database tables found without Alembic tracking. Stamping database to initial schema revision...")
        command.stamp(alembic_cfg, "1a2b3c4d5e6f")
        
    command.upgrade(alembic_cfg, "head")
    print("Alembic database migrations applied successfully.")
except Exception as e:
    print(f"Alembic migration failed to run on startup: {e}")

# Fallback auto-creation
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database connection error or table creation skipped: {e}")
