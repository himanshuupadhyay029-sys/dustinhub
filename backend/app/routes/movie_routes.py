from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Movie, User, MovieRequest
from ..schemas import MovieResponse, MovieRequestCreate, MovieRequestResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/movies", tags=["Movies"])

@router.get("", response_model=List[MovieResponse])
def get_visible_movies(
    q: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all movies that are visible (is_visible = True).
    Allows live filtering by title using the 'q' parameter and category using 'type'.
    Only accessible by logged-in users.
    """
    query = db.query(Movie).filter(Movie.is_visible == True)
    
    if q:
        # Case-insensitive title search
        query = query.filter(Movie.title.ilike(f"%{q}%"))
        
    if type:
        query = query.filter(Movie.type == type)
        
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

@router.post("/requests", response_model=MovieRequestResponse, status_code=status.HTTP_201_CREATED)
def create_movie_request(
    request_in: MovieRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new movie or webseries request.
    """
    db_request = MovieRequest(
        user_id=current_user.id,
        title=request_in.title,
        type=request_in.type,
        needed_by=request_in.needed_by,
        timezone=request_in.timezone,
        status="Pending"
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    db_request.user_email = current_user.email
    return db_request

@router.get("/requests", response_model=List[MovieRequestResponse])
def get_user_movie_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve request history for the logged-in user.
    """
    requests = db.query(MovieRequest).filter(
        MovieRequest.user_id == current_user.id
    ).order_by(MovieRequest.created_at.desc()).all()
    
    for r in requests:
        r.user_email = current_user.email
    return requests

