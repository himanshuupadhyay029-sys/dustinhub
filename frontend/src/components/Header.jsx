import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Search, LayoutDashboard, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const Header = ({ onMenuToggle }) => {
  const { user, logout, isAdmin, searchQuery, setSearchQuery } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAdmin: state.isAdmin,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const username = user?.email ? user.email.split('@')[0].toUpperCase() : 'USER';

  return (
    <header className="w-full bg-cinema-black/85 backdrop-blur-md border-b border-white/5 py-3.5 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
      {/* Left side Logo/Branding with hamburger trigger */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition md:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/" className="flex items-center space-x-3 select-none flex-shrink-0">
          <img src="/logo.png" className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-[0_0_10px_rgba(229,9,20,0.15)]" alt="Logo" />
          <span className="text-lg md:text-xl font-black tracking-widest text-white">
            DUSTIN <span className="text-cinema-red" style={{ textShadow: '0 0 10px rgba(229,9,20,0.4)' }}>HUB</span>
          </span>
        </Link>
      </div>

      {/* Right side search & profile */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Sleek Search Bar */}
        <div className="relative flex items-center bg-zinc-900/60 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-cinema-red/50 focus-within:shadow-[0_0_12px_rgba(229,9,20,0.15)] transition-all duration-300 w-44 sm:w-60 md:w-72">
          <Search className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search movies, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white text-xs placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Admin Dashboard button */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-zinc-800 hover:border-cinema-red/50 hover:bg-cinema-red/5 text-xs font-bold transition duration-300 flex-shrink-0"
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cinema-red" />
            <span className="text-white hidden sm:inline">ADMIN PANEL</span>
          </Link>
        )}

        {/* User profile capsule with dropdown toggle */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2.5 bg-zinc-950/60 border border-white/5 pl-2.5 pr-3.5 py-1.5 rounded-full cursor-pointer select-none hover:bg-zinc-900/60 transition-colors"
            >
              {/* Avatar image/letter circle */}
              <div className="w-6 h-6 rounded-full bg-cinema-red/20 border border-cinema-red/40 flex items-center justify-center text-cinema-red font-black uppercase text-[10px] shadow-[0_0_8px_rgba(229,9,20,0.2)] flex-shrink-0">
                {user.email.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-zinc-300 tracking-wider max-w-[120px] truncate">
                {username}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2.5 w-44 bg-zinc-950 border border-white/5 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center space-x-2.5 w-full px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors"
                >
                  <User className="w-4 h-4 text-cinema-red" />
                  <span>My Profile</span>
                </Link>
                
                <div className="border-t border-white/5 my-1" />

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2.5 w-full px-4 py-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
