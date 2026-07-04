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
        <h3 className="text-sm md:text-base font-bold text-white leading-tight mb-1 truncate">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-[11px] md:text-xs mb-1.5">
          <span className="text-netflix-red font-semibold">{movie.year}</span>
          <span className="text-netflix-textGray">|</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-medium uppercase tracking-wider scale-90">
            {movie.language}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-0.5 rounded bg-netflix-red/20 text-netflix-red font-semibold">
            {movie.genre}
          </span>
          <div className="flex items-center text-yellow-500 font-bold space-x-0.5">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
