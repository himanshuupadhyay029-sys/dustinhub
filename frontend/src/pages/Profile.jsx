import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Shield, Lock, Eye, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`watchlist_${user.email}`) || '[]');
      setWatchlistCount(stored.length);
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password updated successfully (Mock Action)');
    }, 1000);
  };

  const username = user?.email ? user.email.split('@')[0].toUpperCase() : 'MEMBER';

  return (
    <div className="min-h-screen bg-cinema-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-wide uppercase">Your Profile</h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-wider">
            Manage your personal credentials & metrics
          </p>
        </div>

        {/* Profile Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel: Info */}
          <div className="md:col-span-1 bg-zinc-950 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-cinema-red/10 border-2 border-cinema-red flex items-center justify-center text-cinema-red font-black text-3xl shadow-[0_0_20px_rgba(229,9,20,0.2)]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">{username}</h2>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-cinema-red/15 border border-cinema-red/30 text-cinema-red text-[10px] font-black uppercase mt-1">
                <Shield className="w-3 h-3" />
                <span>{user?.role || 'user'}</span>
              </span>
            </div>

            <div className="w-full pt-4 border-t border-white/5 space-y-3 text-left text-sm text-zinc-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span>Member since 2026</span>
              </div>
            </div>
          </div>

          {/* Right panel: Settings Form & Metrics */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex flex-col">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Watchlist Items</span>
                <span className="text-3xl font-black text-white">{watchlistCount}</span>
              </div>
              <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex flex-col">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Streaming Tier</span>
                <span className="text-xl font-black text-white flex items-center gap-1 mt-1">
                  <Sparkles className="w-4 h-4 text-cinema-red fill-cinema-red/25" />
                  Premium Ultra HD
                </span>
              </div>
            </div>

            {/* Change Password Panel */}
            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-cinema-red" />
                <span>Update Password</span>
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-cinema-red hover:bg-cinema-red/90 text-white font-black text-xs uppercase tracking-wider transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving changes...' : 'Save Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
