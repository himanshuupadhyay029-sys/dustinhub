import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Menu, Home, Film, Tv, List, User, LogOut, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from './Header';

const MainLayout = ({ children }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Expanded/Collapsed state for the vertical left sidebar (desktop)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  // Hamburger drawer state (mobile)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Film, path: '/movies', label: 'Movies' },
    { icon: Tv, path: '/webseries', label: 'Web Series' },
    { icon: List, path: '/mylist', label: 'My List' },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: MessageSquare, path: '/requests', label: 'Requests' }
  ];

  return (
    <div className="flex min-h-screen bg-cinema-black text-white overflow-x-hidden">
      {/* 1. Persistent Left Sidebar (Desktop only: hidden md:flex) */}
      <aside 
        className={`bg-zinc-950 border-r border-white/5 hidden md:flex flex-col items-center justify-between py-6 flex-shrink-0 z-50 h-screen sticky top-0 transition-all duration-300 ${
          isSidebarExpanded ? 'w-[200px] md:w-[220px] items-start px-4' : 'w-[70px] md:w-[80px]'
        }`}
      >
        {/* Top: Menu Icon (Hamburger) with toggle handler */}
        <div 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className={`p-2 cursor-pointer text-zinc-400 hover:text-white transition duration-200 w-full flex ${
            isSidebarExpanded ? 'justify-start pl-4' : 'justify-center'
          }`}
          title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-5.5 h-5.5 md:w-6 md:h-6 hover:scale-105 transition-transform" />
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex flex-col space-y-4 md:space-y-5 w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            const buttonContent = (
              <div 
                className={`relative group/btn py-2 px-1 w-full flex items-center cursor-pointer ${
                  isSidebarExpanded ? 'justify-start space-x-3.5 pl-3.5' : 'justify-center'
                }`}
              >
                {/* Active Red indicator tab */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-cinema-red transition-all duration-300 rounded-r-md ${
                    isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 group-hover/btn:opacity-50 group-hover/btn:scale-y-75'
                  }`} 
                />

                <Icon 
                  className={`w-5.5 h-5.5 md:w-6 md:h-6 flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'text-cinema-red scale-105 drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]' : 'text-zinc-500 group-hover/btn:text-zinc-300'
                  }`} 
                />
                
                {/* Text Label - shown inline when expanded */}
                {isSidebarExpanded && (
                  <span className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover/btn:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}

                {/* Floating Tooltip - only rendered when collapsed */}
                {!isSidebarExpanded && (
                  <div className="absolute left-20 bg-zinc-900 border border-zinc-800 text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50 text-white">
                    {item.label}
                  </div>
                )}
              </div>
            );

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
          className={`relative group/btn p-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 w-full flex items-center ${
            isSidebarExpanded ? 'justify-start space-x-3.5 pl-3.5' : 'justify-center'
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
          
          {/* Text Label - shown inline when expanded */}
          {isSidebarExpanded && (
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-400 group-hover/btn:text-red-500">
              Logout
            </span>
          )}

          {/* Floating Tooltip - only rendered when collapsed */}
          {!isSidebarExpanded && (
            <div className="absolute left-20 bg-zinc-900 border border-zinc-800 text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50 text-white">
              Logout
            </div>
          )}
        </button>
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay (Mobile only: md:hidden) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          {/* Drawer content panel */}
          <div className="relative w-64 bg-zinc-950 border-r border-white/5 flex flex-col justify-between py-6 px-4 z-50 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              {/* Drawer Brand Header */}
              <div className="flex items-center space-x-3 px-2 border-b border-white/5 pb-4">
                <img src="/logo.png" className="w-8 h-8 rounded-full object-cover border border-white/10" alt="Logo" />
                <span className="text-md font-black tracking-widest text-white">
                  DUSTIN <span className="text-cinema-red">HUB</span>
                </span>
              </div>

              {/* Navigation list */}
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-cinema-red text-white shadow-lg shadow-cinema-red/20'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Logout action */}
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3.5 px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Global Header (accepts toggle handler to open mobile menu) */}
        <Header onMenuToggle={() => setIsMobileDrawerOpen(true)} />
        
        {/* Dynamic page content */}
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
