import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import MovieCard from '../components/MovieCard';
import client from '../api/client';
import { Search, Loader2, Star, Info, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);

  // Fetch all visible movies initially
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await client.get('/api/movies');
        setMovies(response.data);
        
        // Pick a random top rated movie for the hero banner
        if (response.data.length > 0) {
          const highRated = response.data.filter(m => m.rating >= 8.5);
          const chosen = highRated.length > 0 
            ? highRated[Math.floor(Math.random() * highRated.length)]
            : response.data[0];
          setHeroMovie(chosen);
        }
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Fetch search results when query changes
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const response = await client.get(`/api/movies?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Group movies by genre
  const genres = [...new Set(movies.map((m) => m.genre))];
  const recentlyAdded = [...movies].slice(0, 8); // Top 8 sorted by default created_at desc

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-16">
      <Navbar />

      {/* Hero Banner (Only shown if we have a hero movie and are not currently searching) */}
      {isLoading ? (
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-netflix-red animate-spin" />
          <p className="text-netflix-textGray">Loading catalog...</p>
        </div>
      ) : searchQuery ? (
        // Search spacer to push search results below navbar
        <div className="pt-24"></div>
      ) : heroMovie ? (
        <div className="relative h-[65vh] md:h-[80vh] w-full flex items-end">
          {/* Hero Poster Background */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.poster_url}
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-35"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-black/75"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 px-6 md:px-12 pb-12 md:pb-24 max-w-3xl space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-netflix-red text-white text-xs font-black uppercase tracking-widest">
                Featured
              </span>
              <div className="flex items-center text-yellow-500 font-bold text-sm space-x-1">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span>{heroMovie.rating.toFixed(1)} Rating</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              {heroMovie.title}
            </h1>

            <p className="text-netflix-textGray text-sm md:text-base line-clamp-3 md:line-clamp-4">
              {heroMovie.synopsis}
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <Link
                to={`/movies/${heroMovie.id}`}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-white/80 transition shadow-lg"
              >
                <Info className="w-5 h-5 fill-black" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[30vh] flex items-center justify-center">
          <p className="text-netflix-textGray">No movies available. Check back later!</p>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="px-6 md:px-12 max-w-md mx-auto md:mx-12 my-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-netflix-lightGray/80 border border-white/10 rounded-full pl-12 pr-6 py-3 text-white placeholder-netflix-textGray focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition duration-300 shadow-md"
          />
          <Search className="absolute left-4 top-3.5 text-netflix-textGray w-5 h-5" />
        </div>
      </div>

      {/* Main Browse Content */}
      {!isLoading && (
        <>
          {searchQuery ? (
            /* Search Results Display */
            <div className="px-6 md:px-12 space-y-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-wide">
                Search Results for "{searchQuery}"
              </h2>
              {isSearching ? (
                <div className="flex items-center space-x-2 text-netflix-textGray py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-netflix-textGray py-12 text-center max-w-sm mx-auto">
                  <Film className="w-12 h-12 mx-auto mb-4 text-white/20" />
                  <p className="font-medium text-lg text-white">No results found</p>
                  <p className="text-sm mt-1">Try checking your spelling or search for another movie title.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-4">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Netflix Category Browsing rows */
            <div className="space-y-4 md:space-y-8">
              <MovieRow title="Recently Added" movies={recentlyAdded} />
              
              {genres.map((genre) => {
                const genreMovies = movies.filter((m) => m.genre === genre);
                return (
                  <MovieRow
                    key={genre}
                    title={genre}
                    movies={genreMovies}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
