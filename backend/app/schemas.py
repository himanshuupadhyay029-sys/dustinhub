from datetime import datetime
from typing import Optional
from urllib.parse import urlparse
from pydantic import BaseModel, EmailStr, Field, field_validator
from .models import UserRole

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

# Movie Schemas
class MovieBase(BaseModel):
    title: str = Field(..., min_length=1)
    type: str = Field(default="movie", min_length=1)
    genre: str = Field(..., min_length=1)
    year: int = Field(default=2026, ge=1880, le=2100)
    language: str = Field(..., min_length=1)
    synopsis: str = Field(default="No description available.")
    cast: str = Field(default="N/A")
    rating: float = Field(default=7.0, ge=0.0, le=10.0)
    poster_url: str
    download_link: str
    is_visible: bool = True

    @field_validator('type', mode='before')
    @classmethod
    def val_type(cls, v: Optional[str]) -> str:
        return v if v else "movie"

    @field_validator('genre', mode='before')
    @classmethod
    def val_genre(cls, v: Optional[str]) -> str:
        return v if v else "Movie"

    @field_validator('synopsis', mode='before')
    @classmethod
    def val_synopsis(cls, v: Optional[str]) -> str:
        return v if v else "No description available."

    @field_validator('cast', mode='before')
    @classmethod
    def val_cast(cls, v: Optional[str]) -> str:
        return v if v else "N/A"

    @field_validator('year', mode='before')
    @classmethod
    def val_year(cls, v: Optional[int]) -> int:
        return v if v is not None else 2026

    @field_validator('rating', mode='before')
    @classmethod
    def val_rating(cls, v: Optional[float]) -> float:
        return v if v is not None else 7.0

    @field_validator('poster_url', 'download_link')
    @classmethod
    def validate_urls(cls, v: str) -> str:
        parsed = urlparse(v)
        if not parsed.scheme or parsed.scheme not in ("http", "https"):
            raise ValueError("URL must start with http or https")
        if not parsed.netloc:
            raise ValueError("URL must contain a valid domain/host")
        return v

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    genre: Optional[str] = None
    year: Optional[int] = None
    language: Optional[str] = None
    synopsis: Optional[str] = None
    cast: Optional[str] = None
    rating: Optional[float] = None
    poster_url: Optional[str] = None
    download_link: Optional[str] = None
    is_visible: Optional[bool] = None

    @field_validator('poster_url', 'download_link')
    @classmethod
    def validate_urls(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        parsed = urlparse(v)
        if not parsed.scheme or parsed.scheme not in ("http", "https"):
            raise ValueError("URL must start with http or https")
        if not parsed.netloc:
            raise ValueError("URL must contain a valid domain/host")
        return v

class MovieResponse(MovieBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
