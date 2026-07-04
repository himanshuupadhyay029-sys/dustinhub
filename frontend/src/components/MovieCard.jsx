import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] overflow-hidden rounded-lg bg-netflix-darkGray cursor-pointer transition-all duration-300 hover:scale-[1.08] hover:z-20 border border-white/[0.06] hover:border-red-600/50"
      style={{
        boxShadow: 'var(--card-shadow, 0 4px 20px rgba(0,0,0,0.4))',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.setProperty('--card-shadow', '0 8px 40px rgba(185, 9, 11, 0.35), 0 0 20px rgba(185, 9, 11, 0.15)');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--card-shadow', '0 4px 20px rgba(0,0,0,0.4)');
      }}
    >
      {/* Poster Image — stays vivid on hover, slight brightness boost */}
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:brightness-110"
        loading="lazy"
      />

      {/* Bottom gradient overlay for title readability — only covers bottom 45% */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title & Language Tag — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-sm md:text-base font-bold text-white leading-tight mb-1.5 line-clamp-2 drop-shadow-lg">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-[10px] md:text-[11px]">
          <span className="px-2 py-0.5 rounded-sm bg-netflix-red/90 text-white font-bold uppercase tracking-wider">
            {movie.language}
          </span>
          {movie.genre && (
            <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-white/80 font-medium uppercase tracking-wider">
              {movie.genre}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
