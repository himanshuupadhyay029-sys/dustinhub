from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Movie, User
from ..schemas import MovieResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/movies", tags=["Movies"])

@router.get("", response_model=List[MovieResponse])
def get_visible_movies(
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all movies that are visible (is_visible = True).
    Allows live filtering by title using the 'q' parameter.
    Only accessible by logged-in users.
    """
    query = db.query(Movie).filter(Movie.is_visible == True)
    
    if q:
        # Case-insensitive title search
        query = query.filter(Movie.title.ilike(f"%{q}%"))
        
    return query.order_by(Movie.created_at.desc()).all()

@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie_detail(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed information about a single movie.
    Only movies that are visible can be accessed by regular users.
    """
    movie = db.query(Movie).filter(Movie.id == movie_id, Movie.is_visible == True).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found or is hidden"
        )
    return movie
