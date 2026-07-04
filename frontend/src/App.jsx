import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

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
              primary: '#E50914',
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
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute>
              <Home typeFilter="movie" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webseries" 
          element={
            <ProtectedRoute>
              <Home typeFilter="webseries" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies/:id" 
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          } 
        />

        {/* Guarded Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
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
