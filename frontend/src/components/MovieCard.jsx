import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] overflow-hidden rounded-md bg-netflix-darkGray cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg hover:shadow-2xl border border-white/5"
    >
      {/* Poster Image */}
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
        loading="lazy"
      />

      {/* Info Hover Overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black via-black/60 to-transparent">
        <h3 className="text-sm md:text-base font-black text-white leading-tight mb-2 truncate">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-[11px] md:text-xs">
          <span className="px-2 py-0.5 rounded bg-netflix-red/10 border border-netflix-red/20 text-netflix-red font-black uppercase tracking-wider">
            {movie.language}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
