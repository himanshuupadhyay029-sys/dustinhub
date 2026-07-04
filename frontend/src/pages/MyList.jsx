import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import client from '../api/client';
import MovieCard from '../components/MovieCard';
import { Loader2, Film } from 'lucide-react';

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const watchlistKey = user ? `watchlist_${user.email}` : null;

  useEffect(() => {
    if (watchlistKey) {
      const stored = JSON.parse(localStorage.getItem(watchlistKey) || '[]');
      setWatchlist(stored);
    }
  }, [watchlistKey]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await client.get('/api/movies');
        // Filter movies that exist in user's local watchlist
        const filtered = response.data.filter((m) => watchlist.includes(m.id));
        setMovies(filtered);
      } catch (err) {
        console.error('Failed to load watchlist movies', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (watchlist.length > 0) {
      fetchMovies();
    } else {
      setMovies([]);
      setIsLoading(false);
    }
  }, [watchlist]);

  return (
    <div className="min-h-screen bg-cinema-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8 pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-wide uppercase">My Watchlist</h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-wider">
            Your Bookmarked Movies & Series
          </p>
        </div>

        {isLoading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-cinema-red animate-spin" />
            <p className="text-cinema-textGray">Loading your list...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 border border-white/5 rounded-2xl max-w-md mx-auto">
            <Film className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <h2 className="text-lg font-bold text-white uppercase">Your list is empty</h2>
            <p className="text-sm text-zinc-500 mt-2">
              Explore home, movies, or series catalog and click "Add to List" to bookmark content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
