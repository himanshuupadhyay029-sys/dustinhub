import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { Film, Lock, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // API call to authenticate
      const response = await client.post('/api/auth/login', { email, password });
      const { access_token } = response.data;

      // Fetch user profile info using the token (or decode it)
      // For simplicity, we decode JWT claims or hit a profile endpoint
      // We can also extract the role from the token directly by parsing payload
      const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        email: tokenPayload.sub,
        role: tokenPayload.role
      };

      loginStore(access_token, user);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || 'Invalid email or password';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black px-4 py-12 relative overflow-hidden">
      {/* Red Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-netflix-red/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-netflix-red/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass p-8 md:p-10 rounded-2xl shadow-2xl relative z-10 border border-white/5">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2.5 text-netflix-red font-black text-3xl tracking-wider select-none mb-2">
            <img src="/logo.png" className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
            <span>DUSTIN HUB</span>
          </div>
          <p className="text-netflix-textGray text-sm font-medium">Log in to your account to start browsing</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-netflix-textGray">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-netflix-lightGray border border-white/10 text-white placeholder-netflix-textGray focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-netflix-textGray">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-netflix-lightGray border border-white/10 text-white placeholder-netflix-textGray focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-netflix-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-netflix-red/35 flex items-center justify-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-netflix-textGray space-y-4">
          <div>
            <span>New to Dustin Hub? </span>
            <Link to="/signup" className="text-white hover:text-netflix-red font-bold underline transition duration-200">
              Sign up now
            </Link>
          </div>
          <div className="pt-3 border-t border-white/5">
            <Link to="/admin/login" className="text-netflix-textGray hover:text-netflix-red text-xs font-bold transition duration-200 uppercase tracking-wider">
              Are you an Admin? Access Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
