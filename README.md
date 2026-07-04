# Dustin Hub - Movie Catalog Website (User & Admin Portals)

A full-stack movie discovery and external-download-link directory with a Netflix-style dark theme UI.

---

## Technical Stack

*   **Frontend**: React (Vite) + Tailwind CSS + Zustand + React Router v6 + Axios + react-hot-toast
*   **Backend**: Python FastAPI + SQLAlchemy 2.0 + Alembic + Pydantic v2 + passlib + python-jose + slowapi (rate limiter)
*   **Database**: PostgreSQL 16 (via Docker container)

---

## Project Structure

```
movie-catalog/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── movie_routes.py
│   │   │   └── admin_routes.py
│   │   └── seed.py
│   ├── alembic/
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/ (Login, Signup, Home, MovieDetail, AdminDashboard, AdminLogin)
    │   ├── components/ (Navbar, MovieCard, MovieRow, ProtectedRoute, AdminRoute)
    │   ├── store/ (auth state store)
    │   ├── api/ (axios client)
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── .env
    └── .env.example
```

---

## Setup & Running Guide

Follow these steps sequentially to set up and run the application on your computer:

### Step 1: Start the Postgres Database
Open a terminal in the root directory `himeshnetflix/` and run:
```bash
docker-compose up -d
```
Verify the container is running:
```bash
docker ps
```
*(You should see a container named `himeshnetflix-db` running on port `5433`)*

---

### Step 2: Set Up and Start the Backend API

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a Python Virtual Environment:
   ```bash
   python -m venv venv
   ```
3. Activate the Virtual Environment:
   * **Windows Command Prompt**: `venv\Scripts\activate`
   * **Windows PowerShell**: `.\venv\Scripts\activate`
   * **macOS/Linux**: `source venv/bin/activate`
4. Install Backend Dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Apply Database Migrations (via Alembic):
   ```bash
   alembic upgrade head
   ```
6. Seed the Database (Creates testing accounts and movies):
   ```bash
   python app/seed.py
   ```
7. Start the FastAPI Dev Server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(The API will be available at `http://localhost:8000`. You can view interactive docs at `http://localhost:8000/docs`)*

---

### Step 3: Set Up and Start the Frontend Web App

1. Open a **new terminal** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The website will be available at `http://localhost:5173`)*

---

## Default Testing Credentials

Once you have run the seed script (`python app/seed.py`), you can use the following default accounts for testing:

### 1. Standard User Account
*   **Sign-in Portal**: `http://localhost:5173/login`
*   **Email**: `user@moviecatalog.com`
*   **Password**: `UserSecurePassword2026!`

### 2. Administrator Account
*   **Sign-in Portal**: `http://localhost:5173/admin/login` (A hidden route, inaccessible from public signup/login flows)
*   **Email**: `dustinhubadmin@gmail.com`
*   **Password**: `dustin@1212`

---

## Environment Variables

### Backend `.env` (`backend/.env`)
Already populated with:
```env
DATABASE_URL=postgresql://himanshuadmin:Pass_MovieCatalog_9b3e1f72@localhost:5433/moviecatalog
JWT_SECRET_KEY=bcf45217424d6739db8d7d8e6cb0f49890251787c88b9ea51631de3cd2f2b450
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### Frontend `.env` (`frontend/.env`)
Already populated with:
```env
VITE_API_URL=http://localhost:8000
```
