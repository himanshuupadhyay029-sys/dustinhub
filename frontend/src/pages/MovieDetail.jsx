import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import { ArrowLeft, Star, Download, Globe, Loader2, AlertTriangle, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuthStore((state) => ({ user: state.user }));
  const watchlistKey = user ? `watchlist_${user.email}` : null;

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await client.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (err) {
        console.error('Failed to load movie detail', err);
        setError(err.response?.data?.detail || 'Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    if (movie && watchlistKey) {
      const stored = JSON.parse(localStorage.getItem(watchlistKey) || '[]');
      setIsInWatchlist(stored.includes(movie.id));
    }
  }, [movie, watchlistKey]);

  const toggleWatchlist = () => {
    if (!watchlistKey || !movie) return;
    const stored = JSON.parse(localStorage.getItem(watchlistKey) || '[]');
    let updated;
    if (stored.includes(movie.id)) {
      updated = stored.filter((mid) => mid !== movie.id);
      setIsInWatchlist(false);
      toast.success(`Removed "${movie.title}" from My List`);
    } else {
      updated = [...stored, movie.id];
      setIsInWatchlist(true);
      toast.success(`Added "${movie.title}" to My List`);
    }
    localStorage.setItem(watchlistKey, JSON.stringify(updated));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-black text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-cinema-red animate-spin" />
        <p className="text-cinema-textGray">Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-cinema-black text-white flex flex-col items-center justify-center space-y-4 px-6 text-center">
        <AlertTriangle className="w-16 h-16 text-cinema-red" />
        <h2 className="text-2xl font-bold text-white">Error Loading Movie</h2>
        <p className="text-cinema-textGray max-w-md">{error || 'This movie may have been hidden by the administrator.'}</p>
        <Link
          to="/"
          className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-cinema-red text-white hover:bg-cinema-red/90 font-black transition mt-4 shadow-lg shadow-cinema-red/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-16">
      {/* Cinematic Blur Background Poster */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden opacity-20 z-0 pointer-events-none">
        <img
          src={movie.poster_url}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black"></div>
      </div>

      <div className="relative z-10 pt-8 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-cinema-textGray hover:text-white mb-8 group transition"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column: Poster Image with Red shadow glow */}
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[2/3] overflow-hidden rounded-xl shadow-2xl border border-cinema-red/20 hover:border-cinema-red/45 transition-all duration-300 shadow-cinema-red/10 group">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>

          {/* Right Column: Metadata & Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 uppercase">
                {movie.title}
              </h1>
              
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {/* Language */}
                <div className="flex items-center space-x-1 bg-white/10 text-white font-medium px-3 py-1 rounded-full border border-white/15">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{movie.language}</span>
                </div>
              </div>
            </div>

            {/* Movie Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Synopsis</h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {movie.synopsis || 'No description available for this content.'}
              </p>
            </div>

            {/* Ratings & Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">IMDb Rating</span>
                <div className="flex items-center space-x-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-black text-white">{movie.rating ? movie.rating.toFixed(1) : '7.0'}/10</span>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Release Year</span>
                <span className="text-lg font-black text-white">{movie.year || '2026'}</span>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Genre</span>
                <span className="text-lg font-black text-white line-clamp-1">{movie.genre || 'N/A'}</span>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] font-black text-cinema-red uppercase tracking-widest mb-1">Content Type</span>
                <span className="text-lg font-black text-white capitalize">{movie.type || 'movie'}</span>
              </div>
            </div>

            {/* Cast List */}
            {movie.cast && movie.cast !== 'N/A' && (
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white tracking-wide uppercase">Cast Members</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.split(',').map((actor, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 text-zinc-300 text-xs font-semibold"
                    >
                      {actor.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Download & Watchlist */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={movie.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-cinema-red hover:bg-cinema-red/90 text-white font-black text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-cinema-red/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[3px]" />
                <span>Download Content</span>
              </a>

              <button
                onClick={toggleWatchlist}
                className={`inline-flex items-center space-x-2 px-6 py-4 rounded-xl font-black text-lg transition transform hover:-translate-y-0.5 border ${
                  isInWatchlist
                    ? 'bg-zinc-900 border-cinema-red/30 text-cinema-red shadow-[0_0_15px_rgba(229,9,20,0.1)] hover:bg-zinc-800'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3px]" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>Add to List</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-cinema-textGray mt-2 pl-1">
              Note: This links to an external host (Drive, Mega, etc.). Make sure you have a safe connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
