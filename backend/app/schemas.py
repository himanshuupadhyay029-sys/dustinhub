from datetime import datetime
from typing import Optional, List, Any
import json
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
    tier: str = "Standard"

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
class EpisodeLink(BaseModel):
    name: str = Field(..., min_length=1)
    url: str = Field(..., min_length=1)

    @field_validator('url')
    @classmethod
    def validate_url_field(cls, v: str) -> str:
        parsed = urlparse(v)
        if not parsed.scheme or parsed.scheme not in ("http", "https"):
            raise ValueError("URL must start with http or https")
        if not parsed.netloc:
            raise ValueError("URL must contain a valid domain/host")
        return v

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
    download_link: str = "N/A"
    links: Optional[List[EpisodeLink]] = None
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
        if v == "N/A":
            return v
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
    links: Optional[List[EpisodeLink]] = None
    is_visible: Optional[bool] = None

    @field_validator('poster_url', 'download_link')
    @classmethod
    def validate_urls(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "N/A":
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

    @field_validator('links', mode='before')
    @classmethod
    def parse_links_json(cls, v: Any) -> Any:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v

# Movie Request Schemas
class MovieRequestCreate(BaseModel):
    title: str = Field(..., min_length=1)
    type: str = Field(default="movie", min_length=1)
    needed_by: datetime
    timezone: str = Field(..., min_length=1)

    @field_validator('timezone')
    @classmethod
    def validate_timezone(cls, v: str) -> str:
        if v not in ("IST", "AEST"):
            raise ValueError("Timezone must be 'IST' or 'AEST'")
        return v

class MovieRequestResponse(BaseModel):
    id: int
    user_id: int
    title: str
    type: str
    needed_by: datetime
    timezone: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True

