import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import MovieCard from '../components/MovieCard';
import client from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Star, Info, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = ({ typeFilter }) => {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);

  const { searchQuery, setSearchQuery } = useAuthStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
  }));

  // Reset search query when navigating to a new tab/category
  useEffect(() => {
    setSearchQuery('');
  }, [typeFilter, setSearchQuery]);

  // Fetch movies matching typeFilter
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const url = typeFilter ? `/api/movies?type=${typeFilter}` : '/api/movies';
        const response = await client.get(url);
        setMovies(response.data);
        
        // Pick a random top rated movie for the hero banner
        if (response.data.length > 0) {
          const highRated = response.data.filter(m => m.rating >= 7.5);
          const chosen = highRated.length > 0 
            ? highRated[Math.floor(Math.random() * highRated.length)]
            : response.data[0];
          setHeroMovie(chosen);
        } else {
          setHeroMovie(null);
        }
      } catch (err) {
        console.error('Failed to fetch movies', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [typeFilter]);

  // Fetch search results when query or typeFilter changes
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const url = typeFilter 
          ? `/api/movies?q=${encodeURIComponent(searchQuery)}&type=${typeFilter}`
          : `/api/movies?q=${encodeURIComponent(searchQuery)}`;
        const response = await client.get(url);
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
  }, [searchQuery, typeFilter]);

  // Group movies by genre dynamically
  const genres = [...new Set(movies.map((m) => m.genre))].filter(Boolean);
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
        <div className="relative h-[65vh] md:h-[80vh] w-full flex items-center justify-between px-6 md:px-12 pt-20">
          {/* Background Blurred Ambient Glow */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={heroMovie.poster_url}
              alt=""
              className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-transparent"></div>
          </div>

          {/* Hero Content Grid */}
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-8 pb-12">
            {/* Left Content Column */}
            <div className="flex-1 text-center md:text-left space-y-5">
              <div className="flex items-center justify-center md:justify-start space-x-2.5">
                <span className="px-2.5 py-0.5 rounded bg-netflix-red text-white text-[10px] font-black uppercase tracking-widest">
                  Featured {typeFilter === 'webseries' ? 'Show' : 'Movie'}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  {heroMovie.language}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {heroMovie.title}
              </h1>

              <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
                <Link
                  to={`/movies/${heroMovie.id}`}
                  className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-white text-black font-black hover:bg-white/80 transition transform hover:-translate-y-0.5 shadow-lg"
                >
                  <Info className="w-5 h-5 fill-black" />
                  <span>Get Details</span>
                </Link>
              </div>
            </div>

            {/* Right Poster Column */}
            <div className="hidden md:block w-[240px] lg:w-[280px] aspect-[2/3] overflow-hidden rounded-xl shadow-2xl border border-white/15 transform hover:scale-[1.02] transition duration-300">
              <img
                src={heroMovie.poster_url}
                alt={heroMovie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[30vh] flex items-center justify-center pt-24">
          <p className="text-netflix-textGray">No catalog matches. Check back later!</p>
        </div>
      )}

      {/* Main Browse Content */}
      {!isLoading && (
        <div className="mt-6">
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
            /* Netflix Category Browsing rows grouped by Genre */
            <div className="space-y-4 md:space-y-8">
              {recentlyAdded.length > 0 && (
                <MovieRow title="Recently Added" movies={recentlyAdded} />
              )}
              
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
        </div>
      )}
    </div>
  );
};

export default Home;
