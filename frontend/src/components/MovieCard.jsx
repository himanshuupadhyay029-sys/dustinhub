import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex-none w-[150px] sm:w-[180px] md:w-[210px] aspect-[2/3] overflow-hidden rounded-xl bg-zinc-950 cursor-pointer transition-all duration-300 hover:scale-[1.08] hover:z-20 border-2 border-transparent hover:border-cinema-red/80"
      style={{
        boxShadow: 'var(--card-shadow, 0 4px 20px rgba(0,0,0,0.5))',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.setProperty('--card-shadow', '0 0 25px rgba(229, 9, 20, 0.45), 0 0 10px rgba(229, 9, 20, 0.2)');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--card-shadow', '0 4px 20px rgba(0,0,0,0.5)');
      }}
    >
      {/* Poster Image — stays fully visible and vibrant, slight brightness scale on hover */}
      {imageError ? (
        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4 text-center">
          <Film className="w-8 h-8 text-zinc-800 mb-2 animate-pulse" />
        </div>
      ) : (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.06] group-hover:brightness-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      {/* Bottom gradient mask overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Text details directly overlaying the bottom of the card */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col items-center text-center">
        <h3 className="text-xs sm:text-sm font-black text-white leading-tight uppercase tracking-wider line-clamp-2 drop-shadow-md mb-1.5 group-hover:text-cinema-red transition-colors duration-200">
          {movie.title}
        </h3>
        
        {/* Badges container */}
        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px]">
          <span className="px-1.5 py-0.5 rounded bg-cinema-red/15 border border-cinema-red/30 text-cinema-red font-bold uppercase tracking-widest leading-none">
            {movie.language}
          </span>
          {movie.genre && (
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-medium uppercase tracking-wider leading-none">
              {movie.genre}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
