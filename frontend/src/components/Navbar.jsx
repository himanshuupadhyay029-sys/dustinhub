import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Film, LogOut, LayoutDashboard, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin, searchQuery, setSearchQuery } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAdmin: state.isAdmin,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-netflix-black/90 backdrop-blur-md border-b border-white/5 py-3 px-4 md:px-12 flex items-center justify-between">
      <div className="flex items-center space-x-4 md:space-x-8">
        <Link to="/" className="flex items-center space-x-2 text-netflix-red font-black text-2xl tracking-wider select-none flex-shrink-0">
          <img src="/logo.png" className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" />
          <span className="hidden sm:inline text-xl font-black">DUSTIN HUB</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 sm:space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-xs sm:text-sm font-bold transition duration-200 ${isActive ? 'text-netflix-red font-extrabold border-b-2 border-netflix-red pb-1' : 'text-netflix-textGray hover:text-white pb-1'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/movies" 
              className={({ isActive }) => 
                `text-xs sm:text-sm font-bold transition duration-200 ${isActive ? 'text-netflix-red font-extrabold border-b-2 border-netflix-red pb-1' : 'text-netflix-textGray hover:text-white pb-1'}`
              }
            >
              Movies
            </NavLink>
            <NavLink 
              to="/webseries" 
              className={({ isActive }) => 
                `text-xs sm:text-sm font-bold transition duration-200 ${isActive ? 'text-netflix-red font-extrabold border-b-2 border-netflix-red pb-1' : 'text-netflix-textGray hover:text-white pb-1'}`
              }
            >
              Web Series
            </NavLink>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {user && (
          <>
            {/* Netflix-style Search Input */}
            <div className="relative flex items-center bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1.5 focus-within:border-netflix-red/50 transition-all duration-300 w-28 sm:w-48 md:w-60">
              <Search className="w-3.5 h-3.5 text-netflix-textGray mr-1.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-xs placeholder-netflix-textGray focus:outline-none"
              />
            </div>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span className="hidden md:inline text-white">Admin</span>
              </Link>
            )}

            <div className="flex items-center space-x-1 text-netflix-textGray text-sm">
              <div className="w-7 h-7 rounded-full bg-netflix-red/20 border border-netflix-red/40 flex items-center justify-center text-netflix-red font-black uppercase text-xs">
                {user.email.charAt(0)}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full hover:bg-white/10 text-netflix-textGray hover:text-white transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
