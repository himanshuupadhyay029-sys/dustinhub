import sys
import os

# Add the current directory and the parent directory to python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models import User, UserRole, Movie
from app.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    try:
        print("Checking/Seeding database...")
        # Create Tables if they don't exist (fallback, though Alembic will handle migrations)
        Base.metadata.create_all(bind=engine)

        # 1. Seed Admin User
        admin_email = "dustinhubadmin@gmail.com"
        admin_password = "dustin@1212"
        
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            print(f"Creating admin user: {admin_email}")
            hashed_pwd = get_password_hash(admin_password)
            admin_user = User(
                email=admin_email,
                password_hash=hashed_pwd,
                role=UserRole.admin
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")

        # 2. Seed Standard Sample User for testing
        test_email = "user@moviecatalog.com"
        test_password = "UserSecurePassword2026!"
        test_user = db.query(User).filter(User.email == test_email).first()
        if not test_user:
            print(f"Creating test user: {test_email}")
            hashed_pwd = get_password_hash(test_password)
            test_user = User(
                email=test_email,
                password_hash=hashed_pwd,
                role=UserRole.user
            )
            db.add(test_user)
            db.commit()
            print("Test user created successfully.")
        else:
            print("Test user already exists.")

        # 3. Seed Sample Movies
        sample_movies = [
            {
                "title": "Inception",
                "genre": "Sci-Fi",
                "year": 2010,
                "language": "English",
                "synopsis": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
                "rating": 8.8,
                "poster_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://drive.google.com/file/d/example_inception_id/view?usp=sharing",
                "is_visible": True
            },
            {
                "title": "The Dark Knight",
                "genre": "Action",
                "year": 2008,
                "language": "English",
                "synopsis": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                "cast": "Christian Bale, Heath Ledger, Aaron Eckhart, Maggie Gyllenhaal",
                "rating": 9.0,
                "poster_url": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://mega.nz/file/example_dark_knight_id",
                "is_visible": True
            },
            {
                "title": "Interstellar",
                "genre": "Sci-Fi",
                "year": 2014,
                "language": "English",
                "synopsis": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                "cast": "Matthew McConaughey, Anne Hathaway, Jessica Chastain, John Lithgow",
                "rating": 8.7,
                "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://drive.google.com/file/d/example_interstellar_id/view?usp=sharing",
                "is_visible": True
            },
            {
                "title": "Parasite",
                "genre": "Thriller",
                "year": 2019,
                "language": "Korean",
                "synopsis": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
                "cast": "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik",
                "rating": 8.5,
                "poster_url": "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://drive.google.com/file/d/example_parasite_id/view?usp=sharing",
                "is_visible": True
            },
            {
                "title": "The Matrix",
                "genre": "Action",
                "year": 1999,
                "language": "English",
                "synopsis": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
                "cast": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
                "rating": 8.7,
                "poster_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://mega.nz/file/example_matrix_id",
                "is_visible": True
            },
            {
                "title": "Pulp Fiction",
                "genre": "Crime",
                "year": 1994,
                "language": "English",
                "synopsis": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                "cast": "John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis",
                "rating": 8.9,
                "poster_url": "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://mega.nz/file/example_pulp_fiction_id",
                "is_visible": True
            },
            {
                "title": "Hidden Sample Movie",
                "genre": "Drama",
                "year": 2023,
                "language": "English",
                "synopsis": "This movie should not be visible to standard users, only to administrators.",
                "cast": "Anonymous Actor",
                "rating": 6.5,
                "poster_url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                "download_link": "https://mega.nz/file/example_hidden_movie_id",
                "is_visible": False  # Hidden from general users!
            }
        ]

        for m_data in sample_movies:
            existing_movie = db.query(Movie).filter(Movie.title == m_data["title"]).first()
            if not existing_movie:
                print(f"Adding sample movie: {m_data['title']}")
                new_movie = Movie(**m_data)
                db.add(new_movie)
        
        db.commit()
        print("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
