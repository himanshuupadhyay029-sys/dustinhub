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

# --- Database Initialization & Schema Migration ---
# This runs on every startup to ensure tables exist and schema is up-to-date.
# We use raw SQL for migrations because Alembic files are gitignored and not on the server.
from sqlalchemy import text, inspect as sa_inspect

try:
    # Step 1: Create tables if they don't exist at all (first-time deployment)
    Base.metadata.create_all(bind=engine)
    print("Database tables verified/created successfully.")
except Exception as e:
    print(f"Database table creation error: {e}")

try:
    # Step 2: Run manual schema migrations using raw SQL
    # This handles adding new columns to existing tables (which create_all cannot do)
    inspector = sa_inspect(engine)
    
    if "movies" in inspector.get_table_names():
        existing_columns = [col["name"] for col in inspector.get_columns("movies")]
        
        # Migration: Add 'type' column if it doesn't exist
        if "type" not in existing_columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE movies ADD COLUMN type VARCHAR NOT NULL DEFAULT 'movie'"
                ))
            print("Migration applied: Added 'type' column to movies table.")
        
        # Migration: Add 'links' column if it doesn't exist
        if "links" not in existing_columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE movies ADD COLUMN links TEXT"
                ))
                conn.execute(text(
                    "UPDATE movies SET links = '[{\"name\": \"Download/Stream\", \"url\": \"' || download_link || '\"}]' WHERE links IS NULL"
                ))
            print("Migration applied: Added 'links' column to movies table and backfilled existing data.")
        else:
            print("Movies Schema is up-to-date. No migrations needed.")
    else:
        print("Movies table will be created by create_all above.")

    if "users" in inspector.get_table_names():
        user_columns = [col["name"] for col in inspector.get_columns("users")]
        if "tier" not in user_columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE users ADD COLUMN tier VARCHAR NOT NULL DEFAULT 'Standard'"
                ))
            print("Migration applied: Added 'tier' column to users table.")
        else:
            print("Users Schema is up-to-date. No migrations needed.")
    else:
        print("Users table will be created by create_all above.")
        
except Exception as e:
    print(f"Schema migration error: {e}")
