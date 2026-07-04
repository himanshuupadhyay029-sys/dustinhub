import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import { ArrowLeft, Star, Download, Globe, Calendar, Tag, User2, Loader2, AlertTriangle } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-netflix-red animate-spin" />
          <p className="text-netflix-textGray">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-black text-white">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center space-y-4 px-6 text-center">
          <AlertTriangle className="w-16 h-16 text-netflix-red" />
          <h2 className="text-2xl font-bold text-white">Error Loading Movie</h2>
          <p className="text-netflix-textGray max-w-md">{error || 'This movie may have been hidden by the administrator.'}</p>
          <Link
            to="/"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-netflix-red hover:bg-red-700 font-bold transition mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white pb-16">
      <Navbar />

      {/* Cinematic Blur Background Poster */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden opacity-25 z-0 pointer-events-none">
        <img
          src={movie.poster_url}
          alt=""
          className="w-full h-full object-cover blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black"></div>
      </div>

      <div className="relative z-10 pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-netflix-textGray hover:text-white mb-8 group transition"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column: Poster Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[2/3] overflow-hidden rounded-xl shadow-2xl border border-white/10 group">
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
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
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


            {/* Download Link Trigger Button */}
            <div className="pt-4">
              <a
                href={movie.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-netflix-red hover:bg-red-700 text-white font-black text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-netflix-red/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[3px]" />
                <span>Download Movie</span>
              </a>
              <p className="text-xs text-netflix-textGray mt-2 pl-1">
                Note: This links to an external host (Drive, Mega, etc.). Make sure you have a safe connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
