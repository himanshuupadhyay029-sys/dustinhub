import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, Loader2, LogOut, ArrowLeft, 
  ExternalLink, CheckCircle, RefreshCw, X, Tv, Film, Globe, MessageSquare, Clock, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const { user: currentUser, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const navigate = useNavigate();

  // User Management State
  const [activeTab, setActiveTab] = useState('movies');
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Request Management State
  const [requests, setRequests] = useState([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestSearchQuery, setRequestSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // null means adding a new movie

  // Form Fields State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie'); // 'movie' or 'webseries'
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [cast, setCast] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [links, setLinks] = useState([{ name: 'Download/Stream', url: '' }]);
  const [isVisible, setIsVisible] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/api/admin/movies');
      setMovies(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch movies catalog');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await client.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users list');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleDeleteUser = async (user_id, email) => {
    if (currentUser && user_id === currentUser.id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${email}"?`)) {
      return;
    }

    try {
      await client.delete(`/api/admin/users/${user_id}`);
      setUsers(users.filter(u => u.id !== user_id));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const handleUpdateUserTier = async (userId, newTier) => {
    try {
      await client.put(`/api/admin/users/${userId}/tier?tier=${newTier}`);
      toast.success(`User tier updated to ${newTier}`);
      setUsers(users.map(u => u.id === userId ? { ...u, tier: newTier } : u));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update user tier');
    }
  };

  const fetchRequests = async () => {
    setIsRequestsLoading(true);
    try {
      const response = await client.get('/api/admin/requests');
      setRequests(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch user requests');
    } finally {
      setIsRequestsLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to mark this request as completed?')) {
      return;
    }
    try {
      await client.post(`/api/admin/requests/${requestId}/complete`);
      toast.success('Request marked as completed successfully');
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to complete request');
    }
  };

  const handleOpenAddModalFromRequest = (req) => {
    setEditingMovie(null);
    setTitle(req.title);
    setType(req.type || 'movie');
    setGenre('');
    setYear('2026');
    setLanguage('');
    setRating('7.0');
    setSynopsis('No description available.');
    setCast('N/A');
    setPosterUrl('');
    setLinks([{ name: req.type === 'webseries' ? 'Episode 1' : 'Download/Stream', url: '' }]);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const parseUtcDate = (dateStr) => {
    if (!dateStr) return null;
    const cleanStr = (!dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) ? `${dateStr}Z` : dateStr;
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatInTimeZone = (dateStr, timeZone, label) => {
    try {
      const date = parseUtcDate(dateStr);
      if (!date) return 'N/A';
      const formatter = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: timeZone
      });
      return `${formatter.format(date)} (${label})`;
    } catch (e) {
      return 'N/A';
    }
  };

  useEffect(() => {
    if (activeTab === 'movies') {
      fetchMovies();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchRequests();
    }
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setTitle('');
    setType('movie');
    setGenre('');
    setYear('2026');
    setLanguage('');
    setRating('7.0');
    setSynopsis('No description available.');
    setCast('N/A');
    setPosterUrl('');
    setLinks([{ name: 'Download/Stream', url: '' }]);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setType(movie.type || 'movie');
    setGenre(movie.genre || '');
    setYear((movie.year ?? 2026).toString());
    setLanguage(movie.language);
    setRating((movie.rating ?? 7.0).toString());
    setSynopsis(movie.synopsis || 'No description available.');
    setCast(movie.cast || 'N/A');
    setPosterUrl(movie.poster_url);
    setLinks(
      movie.links && movie.links.length > 0 
        ? movie.links 
        : [{ name: 'Download/Stream', url: movie.download_link || '' }]
    );
    setIsVisible(movie.is_visible);
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (movie_id) => {
    try {
      const response = await client.patch(`/api/admin/movies/${movie_id}/toggle-visibility`);
      const updatedMovie = response.data;
      
      setMovies(movies.map(m => m.id === movie_id ? updatedMovie : m));
      toast.success(`Movie is now ${updatedMovie.is_visible ? 'visible' : 'hidden'}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle visibility status');
    }
  };

  const handleDeleteMovie = async (movie_id, movie_title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${movie_title}"?`)) {
      return;
    }

    try {
      await client.delete(`/api/admin/movies/${movie_id}`);
      setMovies(movies.filter(m => m.id !== movie_id));
      toast.success('Movie deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete movie');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations - only check fields that are in the form
    if (!title || !type || !genre || !language || !posterUrl) {
      toast.error('All standard fields are required');
      return;
    }

    if (links.some(l => !l.name.trim() || !l.url.trim())) {
      toast.error('All mirror links / episode names and URLs are required');
      return;
    }

    // URL validations
    const isValidUrl = (url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (_) {
        return false;
      }
    };

    if (!isValidUrl(posterUrl)) {
      toast.error('Poster URL must be a valid URL starting with http:// or https://');
      return;
    }

    if (links.some(l => !isValidUrl(l.url))) {
      toast.error('All mirror / episode links must be valid URLs starting with http:// or https://');
      return;
    }

    const payload = {
      title,
      type,
      genre,
      year: year ? parseInt(year) : 2026,
      language,
      rating: rating ? parseFloat(rating) : 7.0,
      synopsis: synopsis || 'No description available.',
      cast: cast || 'N/A',
      poster_url: posterUrl,
      download_link: 'N/A', // Set default fallback for schema compatibility
      links: links.map(l => ({ name: l.name.trim(), url: l.url.trim() })),
      is_visible: isVisible
    };

    setIsSubmitLoading(true);
    try {
      if (editingMovie) {
        // Edit Action
        const response = await client.put(`/api/admin/movies/${editingMovie.id}`, payload);
        setMovies(movies.map(m => m.id === editingMovie.id ? response.data : m));
        toast.success('Movie details updated successfully');
      } else {
        // Add Action
        const response = await client.post('/api/admin/movies', payload);
        setMovies([response.data, ...movies]);
        toast.success('New movie added to catalog');
        fetchRequests(); // Automatically sync requests since this movie might resolve a pending request
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Failed to save changes';
      toast.error(errMsg);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out from Admin area');
    navigate('/admin/login');
  };

  // Search filter
  const filteredMovies = movies.filter(movie => 
    (movie.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (movie.genre || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(req => 
    (req.title || '').toLowerCase().includes(requestSearchQuery.toLowerCase()) ||
    (req.user_email || '').toLowerCase().includes(requestSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-16">
      {/* Inline Dashboard Header inside MainLayout content flow */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase text-cinema-red tracking-wide" style={{ textShadow: '0 0 10px rgba(229, 9, 20, 0.15)' }}>
            Control Panel
          </h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Dustin Hub Manager</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={activeTab === 'movies' ? fetchMovies : activeTab === 'users' ? fetchUsers : fetchRequests}
            className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200"
            title="Refresh database list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex border-b border-zinc-800 bg-[#090909]">
        <button
          onClick={() => setActiveTab('movies')}
          className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-200 ${
            activeTab === 'movies'
              ? 'border-cinema-red text-cinema-red'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Manage Movie Catalog
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-200 ${
            activeTab === 'users'
              ? 'border-cinema-red text-cinema-red'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Manage Registered Users
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-200 ${
            activeTab === 'requests'
              ? 'border-cinema-red text-cinema-red'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Manage User Requests
        </button>
      </div>

      {/* Control Actions & Search */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {activeTab === 'movies' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* Search bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search table by title or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-cinema-red"
                />
                <Search className="absolute left-3 top-3 text-zinc-500 w-4 h-4" />
              </div>

              {/* Add movie button */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center space-x-2 bg-cinema-red hover:bg-cinema-red/90 text-white font-black px-5 py-2.5 rounded-lg text-sm transition shadow-lg shadow-cinema-red/15"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
                <span>Add New Movie</span>
              </button>
            </div>

            {/* Catalog Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                  <p className="text-zinc-500 text-sm">Loading active catalog...</p>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-zinc-400 font-bold text-lg">No movies found</p>
                  <p className="text-zinc-600 text-sm mt-1">Try resetting your search query or add a new movie.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold text-xs uppercase bg-zinc-900/50">
                        <th className="py-4 px-6">Movie Info</th>
                        <th className="py-4 px-6">Genre</th>
                        <th className="py-4 px-6 text-center">Rating</th>
                        <th className="py-4 px-6 text-center">Visibility</th>
                        <th className="py-4 px-6">Stream / Mirror Links</th>
                        <th className="py-4 px-6">Updated At</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredMovies.map((movie) => (
                        <tr key={movie.id} className="hover:bg-zinc-900/30 transition">
                          {/* Movie Info */}
                          <td className="py-4 px-6 flex items-center space-x-3">
                            <img 
                              src={movie.poster_url} 
                              alt="" 
                              className="w-10 h-14 object-cover rounded bg-zinc-900 border border-zinc-800" 
                            />
                            <div>
                              <div className="font-bold text-white leading-tight">{movie.title}</div>
                              <div className="text-xs text-zinc-500 mt-1.5 flex items-center space-x-2">
                                <span className="uppercase text-[9px] font-black tracking-wider text-red-500 border border-red-500/30 rounded px-1 py-0.5 bg-red-500/5">
                                  {movie.type === 'webseries' ? 'Web Series' : 'Movie'}
                                </span>
                                <span>{movie.year} | {movie.language}</span>
                              </div>
                            </div>
                          </td>

                          {/* Genre */}
                          <td className="py-4 px-6 text-zinc-300 font-medium">
                            {movie.genre}
                          </td>

                          {/* Rating */}
                          <td className="py-4 px-6 text-center font-bold text-yellow-500">
                            {movie.rating.toFixed(1)}
                          </td>

                          {/* Visibility Status */}
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleToggleVisibility(movie.id)}
                              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition ${
                                movie.is_visible 
                                  ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                              }`}
                              title="Click to toggle visibility"
                            >
                              {movie.is_visible ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Visible</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Stream / Mirror Links Count */}
                          <td className="py-4 px-6 text-zinc-400">
                            <span className="font-semibold text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-xs">
                              {movie.links && movie.links.length > 0 ? `${movie.links.length} Links / Ep` : '1 Link'}
                            </span>
                          </td>

                          {/* Updated Date */}
                          <td className="py-4 px-6 text-zinc-500 text-xs">
                            {new Date(movie.updated_at).toLocaleString()}
                          </td>

                          {/* CRUD Actions */}
                          <td className="py-4 px-6 text-right space-x-1.5">
                            <button
                              onClick={() => handleOpenEditModal(movie)}
                              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition"
                              title="Edit movie"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie.id, movie.title)}
                              className="p-2 rounded bg-red-950/20 hover:bg-red-950 border border-red-900/30 text-red-500 hover:text-white transition"
                              title="Delete movie permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'users' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* User search bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search users by email or role..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <Search className="absolute left-3 top-3 text-zinc-500 w-4 h-4" />
              </div>
              
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">
                Total Users: <span className="text-white">{filteredUsers.length}</span>
              </div>
            </div>

            {/* Users list table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              {isUsersLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                  <p className="text-zinc-500 text-sm">Loading users database...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-zinc-400 font-bold text-lg">No users found</p>
                  <p className="text-zinc-600 text-sm mt-1">Try resetting your search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold text-xs uppercase bg-zinc-900/50">
                        <th className="py-4 px-6">Email Address</th>
                        <th className="py-4 px-6 text-center">Role</th>
                        <th className="py-4 px-6">Joined Date</th>
                        <th className="py-4 px-6 text-center">Streaming Tier</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-900/30 transition">
                          {/* Email Address */}
                          <td className="py-4 px-6 font-semibold text-white">
                            {u.email}
                            {currentUser && u.id === currentUser.id && (
                              <span className="ml-2.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-black tracking-wider">
                                You
                              </span>
                            )}
                          </td>

                          {/* Role */}
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${
                              u.role === 'admin' 
                                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                                : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                            }`}>
                              {u.role}
                            </span>
                          </td>

                          {/* Created At */}
                          <td className="py-4 px-6 text-zinc-500">
                            {new Date(u.created_at).toLocaleString()}
                          </td>

                          {/* Streaming Tier Selection */}
                          <td className="py-4 px-6 text-center">
                            <select
                              value={u.tier || 'Standard'}
                              onChange={(e) => handleUpdateUserTier(u.id, e.target.value)}
                              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cinema-red cursor-pointer"
                            >
                              <option value="Free">Free</option>
                              <option value="Standard">Standard</option>
                              <option value="Premium">Premium</option>
                              <option value="Ultra HD">Ultra HD</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              disabled={currentUser && u.id === currentUser.id}
                              className="p-2 rounded bg-red-950/20 hover:bg-red-950 border border-red-900/30 text-red-500 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed"
                              title={currentUser && u.id === currentUser.id ? "Cannot delete yourself" : "Delete user permanently"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Requests Panel */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* Search bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search requests by title or email..."
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-cinema-red"
                />
                <Search className="absolute left-3 top-3 text-zinc-500 w-4 h-4" />
              </div>
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-wider">
                Total Requests: <span className="text-white">{filteredRequests.length}</span>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              {isRequestsLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                  <p className="text-zinc-500 text-sm">Loading user requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-zinc-400 font-bold text-lg">No requests found</p>
                  <p className="text-zinc-600 text-sm mt-1">Try resetting your search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-bold text-xs uppercase bg-zinc-900/50">
                        <th className="py-4 px-6">User Email</th>
                        <th className="py-4 px-6">Requested Title</th>
                        <th className="py-4 px-6 text-center">Type</th>
                        <th className="py-4 px-6">Target Needed Time (IST / Melbourne)</th>
                        <th className="py-4 px-6 text-center">Status</th>
                        <th className="py-4 px-6">Date Requested</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-zinc-900/30 transition">
                          {/* User Email */}
                          <td className="py-4 px-6 font-semibold text-white">
                            {req.user_email}
                          </td>

                          {/* Title */}
                          <td className="py-4 px-6 font-bold text-white uppercase tracking-wide">
                            {req.title}
                          </td>

                          {/* Type */}
                          <td className="py-4 px-6 text-center">
                            <span className="uppercase text-[9px] font-black tracking-wider text-red-500 border border-red-500/30 rounded px-1.5 py-0.5 bg-red-500/5">
                              {req.type === 'webseries' ? 'Web Series' : 'Movie'}
                            </span>
                          </td>

                          {/* Needed Time */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col space-y-1">
                              <span className={`text-xs ${req.timezone === 'IST' ? 'text-white font-extrabold' : 'text-zinc-400'}`}>
                                {formatInTimeZone(req.needed_by, 'Asia/Kolkata', 'IST')}
                              </span>
                              <span className={`text-xs ${req.timezone === 'AEST' ? 'text-white font-extrabold' : 'text-zinc-400'}`}>
                                {formatInTimeZone(req.needed_by, 'Australia/Melbourne', 'Melbourne Time')}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              req.status === 'Completed' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            }`}>
                              {req.status}
                            </span>
                          </td>

                          {/* Date Requested */}
                          <td className="py-4 px-6 text-zinc-500 text-xs">
                            {parseUtcDate(req.created_at)?.toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right space-x-2">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleOpenAddModalFromRequest(req)}
                                  className="px-3 py-1.5 rounded bg-cinema-red hover:bg-cinema-red/90 text-white font-black text-xs uppercase tracking-wider transition"
                                  title="Open upload modal with this title pre-filled"
                                >
                                  Upload
                                </button>
                                <button
                                  onClick={() => handleCompleteRequest(req.id)}
                                  className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition text-xs font-bold animate-in duration-200"
                                  title="Mark completed directly"
                                >
                                  Complete
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add/Edit Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-black tracking-wide uppercase text-white">
                {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie Entry'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Movie Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Inception"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                  />
                </div>

                {/* Type Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Content Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white cursor-pointer"
                  >
                    <option value="movie">Movie</option>
                    <option value="webseries">Web Series</option>
                  </select>
                </div>

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Genre</label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Action, Comedy, Sci-Fi"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                  />
                </div>

                {/* Language */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Language</label>
                  <input
                    type="text"
                    required
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English, Korean"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400 block mb-2">Default Visibility</label>
                  <label className="inline-flex items-center space-x-2 cursor-pointer mt-1 select-none">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-800 text-red-600 focus:ring-red-600 focus:ring-offset-zinc-950 w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-zinc-300">Visible to Public site</span>
                  </label>
                </div>
              </div>


              {/* Poster URL */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-zinc-400">Poster Image URL (valid http/https link)</label>
                <input
                  type="url"
                  required
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                />
              </div>

              {/* Dynamic Episodes / Mirror Links Editor */}
              <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-zinc-400">
                    {type === 'webseries' ? 'Episodes / Seasons Links' : 'Stream / Download Mirrors'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setLinks([...links, { name: type === 'webseries' ? `Episode ${links.length + 1}` : `Server ${links.length + 1}`, url: '' }])}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-zinc-850 hover:bg-zinc-800 text-[10px] font-black uppercase text-white transition border border-zinc-800"
                  >
                    <span>+ Add Link / Episode</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2 animate-in fade-in duration-200">
                      {/* Name/Label */}
                      <input
                        type="text"
                        required
                        value={link.name}
                        onChange={(e) => {
                          const updated = [...links];
                          updated[index].name = e.target.value;
                          setLinks(updated);
                        }}
                        placeholder={type === 'webseries' ? 'e.g. Episode 1' : 'e.g. Server 1'}
                        className="w-1/3 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                      />

                      {/* URL */}
                      <input
                        type="url"
                        required
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...links];
                          updated[index].url = e.target.value;
                          setLinks(updated);
                        }}
                        placeholder="https://drive.google.com/... or https://..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                      />

                      {/* Delete button */}
                      {links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = links.filter((_, i) => i !== index);
                            setLinks(updated);
                          }}
                          className="p-2 rounded hover:bg-red-500/10 text-red-500 hover:text-red-400 transition"
                          title="Remove link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="flex items-center space-x-1.5 bg-cinema-red hover:bg-cinema-red/90 text-white font-black px-5 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{editingMovie ? 'Save Changes' : 'Publish Movie'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
