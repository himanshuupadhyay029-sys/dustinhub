import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, Loader2, LogOut, ArrowLeft, 
  ExternalLink, CheckCircle, RefreshCw, X 
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // null means adding a new movie

  // Form Fields State
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [cast, setCast] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
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

  useEffect(() => {
    if (activeTab === 'movies') {
      fetchMovies();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setTitle('');
    setGenre('');
    setYear('');
    setLanguage('');
    setRating('');
    setSynopsis('');
    setCast('');
    setPosterUrl('');
    setDownloadLink('');
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setGenre(movie.genre);
    setYear(movie.year.toString());
    setLanguage(movie.language);
    setRating(movie.rating.toString());
    setSynopsis(movie.synopsis);
    setCast(movie.cast);
    setPosterUrl(movie.poster_url);
    setDownloadLink(movie.download_link);
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

    // Basic Validations
    if (!title || !genre || !year || !language || !rating || !synopsis || !cast || !posterUrl || !downloadLink) {
      toast.error('All fields are required');
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

    if (!isValidUrl(downloadLink)) {
      toast.error('Download Link must be a valid URL starting with http:// or https://');
      return;
    }

    const payload = {
      title,
      genre,
      year: parseInt(year),
      language,
      rating: parseFloat(rating),
      synopsis,
      cast,
      poster_url: posterUrl,
      download_link: downloadLink,
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
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title="Go to main site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-wide flex items-center gap-1.5 uppercase text-red-500">
              Control Panel
            </h1>
            <p className="text-xs text-zinc-500 font-bold">DUSTIN HUB MANAGER</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={activeTab === 'movies' ? fetchMovies : fetchUsers}
            className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-900/20 text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex border-b border-zinc-800 bg-[#090909]">
        <button
          onClick={() => setActiveTab('movies')}
          className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-200 ${
            activeTab === 'movies'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Manage Movie Catalog
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-200 ${
            activeTab === 'users'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Manage Registered Users
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <Search className="absolute left-3 top-3 text-zinc-500 w-4 h-4" />
              </div>

              {/* Add movie button */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center space-x-2 bg-red-700 hover:bg-red-600 px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg"
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
                        <th className="py-4 px-6">Download Link</th>
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
                              <div className="text-xs text-zinc-500 mt-1">{movie.year} | {movie.language}</div>
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

                          {/* Download Link */}
                          <td className="py-4 px-6 max-w-[200px] truncate text-zinc-400">
                            <a 
                              href={movie.download_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-red-500 inline-flex items-center space-x-1 hover:underline"
                            >
                              <span className="truncate">{movie.download_link}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
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
        ) : (
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

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Genre</label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Sci-Fi, Action, Drama"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Release Year</label>
                  <input
                    type="number"
                    required
                    min="1880"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2010"
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

                {/* Rating */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-zinc-400">Rating (0.0 to 10.0)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 8.8"
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

              {/* Cast */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-zinc-400">Cast Members (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
                  placeholder="Leonardo DiCaprio, Tom Hardy, Cillian Murphy"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                />
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

              {/* Download URL */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-zinc-400">External Download Link (valid http/https link)</label>
                <input
                  type="url"
                  required
                  value={downloadLink}
                  onChange={(e) => setDownloadLink(e.target.value)}
                  placeholder="https://drive.google.com/... or https://mega.nz/..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white"
                />
              </div>

              {/* Synopsis */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-zinc-400">Synopsis / Description</label>
                <textarea
                  required
                  rows="3"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Describe the movie story here..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent text-white resize-none"
                />
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
                  className="flex items-center space-x-1.5 bg-red-700 hover:bg-red-600 px-5 py-2.5 rounded-lg font-bold text-sm transition text-white disabled:opacity-50"
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
