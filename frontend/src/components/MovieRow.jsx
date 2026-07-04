import { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-4 px-6 md:px-12 my-8 relative group">
      <h2 className="text-lg md:text-2xl font-bold tracking-wide text-white hover:text-cinema-cyan transition-colors duration-200">
        {title}
      </h2>

      {/* Row Wrapper with buttons */}
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-40 h-full w-12 items-center justify-center bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto overflow-y-hidden no-scrollbar py-2 px-1 scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-40 h-full w-12 items-center justify-center bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
