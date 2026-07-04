import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Menu, Home, Film, Tv, List, User, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from './Header';

const MainLayout = ({ children }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Film, path: '/movies', label: 'Movies' },
    { icon: Tv, path: '/webseries', label: 'Web Series' },
    { icon: List, path: '#', label: 'My List' },
    { icon: User, path: '#', label: 'Profile' },
    { icon: Settings, path: '#', label: 'Settings' }
  ];

  return (
    <div className="flex min-h-screen bg-cinema-black text-white overflow-hidden">
      {/* Persistent Left Sidebar */}
      <aside className="w-[70px] md:w-[80px] bg-zinc-950 border-r border-white/5 flex flex-col items-center justify-between py-6 flex-shrink-0 z-50 h-screen fixed top-0 left-0">
        {/* Top: Menu Icon */}
        <div className="p-2 cursor-pointer text-zinc-400 hover:text-white transition duration-200">
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex flex-col space-y-5 md:space-y-6 w-full items-center">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isDummy = item.path === '#';
            const isActive = location.pathname === item.path;

            const buttonContent = (
              <div className="relative group/btn py-2 px-1 w-full flex items-center justify-center cursor-pointer">
                {/* Active Cyan Left Highlight indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cinema-cyan rounded-r-md shadow-[0_0_10px_#00e5ff]" />
                )}
                
                {/* Icon Container with subtle glow on active/hover */}
                <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-cinema-cyan/10 text-cinema-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}>
                  <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover/btn:scale-110" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-20 bg-zinc-900 border border-zinc-800 text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                  {item.label}
                </div>
              </div>
            );

            if (isDummy) {
              return <div key={idx} className="w-full">{buttonContent}</div>;
            }

            return (
              <NavLink key={item.path} to={item.path} className="w-full">
                {buttonContent}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: Logout */}
        <button
          onClick={handleLogout}
          className="relative group/btn p-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6" />
          
          {/* Tooltip */}
          <div className="absolute left-20 bg-zinc-900 border border-zinc-800 text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50 text-white">
            Logout
          </div>
        </button>
      </aside>

      {/* Main Content Area (offset by sidebar width) */}
      <div className="flex-1 flex flex-col min-h-screen pl-[70px] md:pl-[80px]">
        {/* Global Header */}
        <Header />
        
        {/* Dynamic page content */}
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
