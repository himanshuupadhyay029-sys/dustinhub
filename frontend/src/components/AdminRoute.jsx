import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin
  }));

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
