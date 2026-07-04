import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum, Text
from .database import Base

class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    type = Column(String, default="movie", nullable=False) # e.g. movie, webseries
    genre = Column(String, nullable=False) # e.g. Action, Drama
    year = Column(Integer, nullable=False)
    language = Column(String, nullable=False)
    synopsis = Column(Text, nullable=False)
    cast = Column(Text, nullable=False) # comma-separated string
    rating = Column(Float, nullable=False)
    poster_url = Column(String, nullable=False)
    download_link = Column(String, nullable=False)
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
