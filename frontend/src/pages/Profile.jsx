import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { User, Shield, Calendar, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuthStore((state) => ({ user: state.user, updateUser: state.updateUser }));
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await client.get('/api/auth/me');
        updateUser(response.data);
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    };
    fetchUserProfile();
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem(`watchlist_${user.email}`) || '[]');
      setWatchlistCount(stored.length);
    }
  }, [user]);

  const username = user?.email ? user.email.split('@')[0].toUpperCase() : 'MEMBER';
  const assignedTier = user?.tier || 'Standard';

  return (
    <div className="min-h-screen bg-cinema-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-wide uppercase">Your Profile</h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-wider">
            Examine your account parameters & metrics
          </p>
        </div>

        {/* Profile Details Layout */}
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

          {/* Right panel: Metrics */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex flex-col justify-center min-h-[140px] shadow-lg">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Watchlist Items</span>
                <span className="text-3xl font-black text-white">{watchlistCount}</span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Total bookmarked titles</span>
              </div>

              <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex flex-col justify-center min-h-[140px] shadow-lg">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Streaming Tier</span>
                <span className="text-xl font-black text-white flex items-center gap-1.5 mt-1 uppercase">
                  <Sparkles className="w-4.5 h-4.5 text-cinema-red fill-cinema-red/25" />
                  {assignedTier}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Assigned tier profile</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider">Account Notice</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                This is a private secure portal. If you require level adjustments or streaming tier elevation, please contact the lead system administrator directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
