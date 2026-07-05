import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import UserRequests from './pages/UserRequests';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#181818',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#00e5ff',
              secondary: '#fff',
            },
          },
        }} 
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Guarded User Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home typeFilter="movie" />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webseries" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home typeFilter="webseries" />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <MovieDetail />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mylist" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyList />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserRequests />
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        {/* Guarded Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </AdminRoute>
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
