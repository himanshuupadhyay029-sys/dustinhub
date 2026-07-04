import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Film, LogOut, LayoutDashboard, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAdmin: state.isAdmin,
  }));
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 text-netflix-red font-black text-2xl tracking-wider select-none">
        <img src="/logo.png" className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" />
        <span>DUSTIN HUB</span>
      </Link>

      <div className="flex items-center space-x-4 md:space-x-6">
        {user && (
          <>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Link>
            )}

            <div className="flex items-center space-x-2 text-netflix-textGray text-sm">
              <div className="w-8 h-8 rounded-full bg-netflix-red/20 border border-netflix-red/40 flex items-center justify-center text-netflix-red font-bold uppercase">
                {user.email.charAt(0)}
              </div>
              <span className="hidden md:inline font-medium">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10 text-netflix-textGray hover:text-white transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
