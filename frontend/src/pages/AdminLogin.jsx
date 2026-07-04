import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { ShieldAlert, Lock, Mail, Loader2, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await client.post('/api/admin/login', { email, password });
      const { access_token } = response.data;

      // Extract user details from token payload
      const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        email: tokenPayload.sub,
        role: tokenPayload.role
      };

      loginStore(access_token, user);
      toast.success('Access Granted. Welcome Administrator!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || 'Unauthorized access';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] px-4 py-12 relative overflow-hidden">
      {/* Background Red/Purple Glow */}
      <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-950 border border-red-900/20 p-8 md:p-10 rounded-2xl shadow-2xl relative z-10">
        {/* Admin Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" className="w-16 h-16 rounded-full object-cover border border-red-900/30 shadow-md mb-4 animate-pulse" alt="" />
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Admin Portal</h2>
          <p className="text-zinc-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Authorizing...
              </>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase text-zinc-400 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to User Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
