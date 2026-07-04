# Running Dustin Hub Locally

Your Postgres database is now successfully running in a Docker container on port **5433**.

Follow this guide to get the backend API and frontend React application running on your local machine.

---

## Part 1: Start the Backend API

1. **Open a new terminal** in the root of the project (`himeshnetflix/`) and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. **Create a Python Virtual Environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**:
   * **In PowerShell**:
     ```powershell
     .\venv\Scripts\activate
     ```
   * **In Command Prompt (cmd)**:
     ```cmd
     venv\Scripts\activate
     ```

4. **Install all Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Apply Database Migrations** (This creates the users and movies tables inside Postgres):
   ```bash
   alembic upgrade head
   ```

6. **Seed the Database** (This populates the database with test accounts and sample movies):
   ```bash
   python app/seed.py
   ```

7. **Start the FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

*(Keep this terminal running. The API will be active at `http://localhost:8000`)*

---

## Part 2: Start the Frontend Web App

1. **Open a second terminal window** in the root of the project (`himeshnetflix/`) and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. **Install all Node Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Dev Server**:
   ```bash
   npm run dev
   ```

*(Keep this terminal running. The website will be active at `http://localhost:5173`)*

---

## Part 3: Test and Browse the Website

Now, open your browser and navigate to **`http://localhost:5173`**.

You can log in and test using the following pre-configured credentials:

### 1. Test as a Regular User
*   **Login URL**: `http://localhost:5173/login`
*   **Email**: `user@moviecatalog.com`
*   **Password**: `UserSecurePassword2026!`
*   *Action*: Browse movie rows, search for a title (e.g., "Inception"), and click a movie to view metadata and test the external download link.

### 2. Test as an Administrator
*   **Login URL**: `http://localhost:5173/admin/login` (a separate, secure login page)
*   **Email**: `dustinhubadmin@gmail.com`
*   **Password**: `dustin@1212`
*   *Action*: Manage the catalog. You can add new movies, edit fields, permanently delete movies, or click the Eye/Eye-Off icons to toggle public visibility.
