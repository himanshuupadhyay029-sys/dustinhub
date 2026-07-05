from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from ..database import get_db
from ..models import Movie, User, UserRole, MovieRequest
from ..schemas import MovieCreate, MovieUpdate, MovieResponse, UserLogin, Token, UserResponse, MovieRequestResponse
from ..auth import get_current_admin, verify_password, create_access_token
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["Admin Actions"])

# Rate limit admin login separately as well
limiter = Limiter(key_func=get_remote_address)

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def admin_login(request: Request, credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Separate admin login portal. Authenticates admin credentials.
    Returns 403 Forbidden if user is authenticated but not an admin.
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Enforce admin role check server-side
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin portal is only accessible by administrators."
        )
        
    # Generate admin JWT token
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/movies", response_model=List[MovieResponse])
def get_all_movies_admin(
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Get all movies (both visible and hidden).
    Only accessible by administrators.
    """
    query = db.query(Movie)
    if q:
        query = query.filter(Movie.title.ilike(f"%{q}%") | Movie.genre.ilike(f"%{q}%"))
    return query.order_by(Movie.created_at.desc()).all()

@router.post("/movies", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def add_movie(
    movie_in: MovieCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Create a new movie entry.
    Only accessible by administrators.
    """
    db_movie = Movie(**movie_in.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    
    # Auto-complete pending user requests for this movie / webseries (case-insensitive)
    matching_requests = db.query(MovieRequest).filter(
        MovieRequest.status == "Pending",
        MovieRequest.type == db_movie.type,
        MovieRequest.title.ilike(db_movie.title)
    ).all()
    
    for req in matching_requests:
        req.status = "Completed"
        req.completed_at = datetime.utcnow()
        
    if matching_requests:
        db.commit()
        
    return db_movie

@router.put("/movies/{movie_id}", response_model=MovieResponse)
def update_movie(
    movie_id: int,
    movie_in: MovieUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update movie metadata and external links.
    Only accessible by administrators.
    """
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    
    update_data = movie_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_movie, field, value)
        
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/movies/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_movie_permanently(
    movie_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Delete a movie entry permanently.
    Only accessible by administrators.
    """
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    db.delete(db_movie)
    db.commit()
    return None

@router.patch("/movies/{movie_id}/toggle-visibility", response_model=MovieResponse)
def toggle_movie_visibility(
    movie_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Toggle is_visible flag between true and false.
    Only accessible by administrators.
    """
    db_movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not db_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    db_movie.is_visible = not db_movie.is_visible
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.get("/users", response_model=List[UserResponse])
def get_all_users_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Get list of all registered user accounts.
    Only accessible by administrators.
    """
    return db.query(User).order_by(User.created_at.desc()).all()

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Delete a user account permanently from the database.
    Only accessible by administrators. Prevents self-deletion.
    """
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account."
        )
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found."
        )
    
    db.delete(db_user)
    db.commit()
    return None

@router.put("/users/{user_id}/tier", response_model=UserResponse)
def update_user_tier(
    user_id: int,
    tier: str = Query(..., description="The tier to assign, e.g. Free, Standard, Premium, Ultra HD"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update a user account's assigned streaming tier.
    Only accessible by administrators.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found."
        )
    db_user.tier = tier
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/requests", response_model=List[MovieRequestResponse])
def get_all_movie_requests_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Get all user movie/webseries requests.
    Only accessible by administrators.
    """
    results = db.query(MovieRequest, User.email).join(User, MovieRequest.user_id == User.id).order_by(MovieRequest.created_at.desc()).all()
    
    requests = []
    for request, email in results:
        request.user_email = email
        requests.append(request)
    return requests

@router.post("/requests/{request_id}/complete", response_model=MovieRequestResponse)
def complete_movie_request_admin(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Manually complete a movie request.
    Only accessible by administrators.
    """
    db_request = db.query(MovieRequest).filter(MovieRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    db_request.status = "Completed"
    db_request.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_request)
    
    # Fill user_email for the response
    user = db.query(User).filter(User.id == db_request.user_id).first()
    db_request.user_email = user.email if user else "Unknown"
    return db_request
