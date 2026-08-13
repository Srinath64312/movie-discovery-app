import { useState, useEffect } from 'react';
import { Film, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

// Genres Mapping
const GENRES = [
  { id: 0, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

export const getGenreName = (id: number) => {
  const genre = GENRES.find(g => g.id === id);
  return genre ? genre.name : 'Unknown';
};

interface HomeProps {
  movies: any[];
  loading: boolean;
  query: string;
  setQuery: (q: string) => void;
  watchlist: any[];
  toggleWatchlist: (m: any) => void;
  listType: string;
  fetchCategory: (type: string) => void;
}

export default function Home({ movies, loading, query, setQuery, watchlist, toggleWatchlist, listType, fetchCategory }: HomeProps) {
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);

  useEffect(() => {
    let result = movies;
    if (selectedGenre !== 0) {
      result = result.filter(m => m.genre_ids?.includes(selectedGenre));
    }
    setFilteredMovies(result);
  }, [selectedGenre, movies]);

  return (
    <div className="pt-16 min-h-screen pb-12">
      {/* Hero Section */}
      {!query && movies.length > 0 && selectedGenre === 0 && (
        <div className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={movies[0].backdrop_path ? `https://image.tmdb.org/t/p/original${movies[0].backdrop_path}` : `https://picsum.photos/seed/${movies[0].id}bg/1920/1080`} 
              alt="Hero Backdrop"
              className="w-full h-full object-cover opacity-30 blur-[2px] scale-105 bg-black"
              onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${movies[0].id}bg/1920/1080`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row items-center gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>#1 Trending Today</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">
                {movies[0].title || movies[0].name}
              </h1>
              
              <div className="flex items-center space-x-4 text-muted-foreground font-medium">
                <span className="flex items-center text-yellow-500">
                  <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {movies[0].vote_average?.toFixed(1) || 'NR'}
                </span>
                <span>•</span>
                <span>{movies[0].release_date?.split('-')[0] || 'TBA'}</span>
              </div>

              <p className="text-lg text-muted-foreground/90 max-w-lg line-clamp-3 leading-relaxed">
                {movies[0].overview || 'Experience the most highly anticipated cinematic masterpiece.'}
              </p>
              <div className="flex space-x-4 pt-4">
                <Link 
                  to={`/movie/${movies[0].id}`}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all hover:scale-105 shadow-lg shadow-primary/30"
                >
                  <Play size={20} className="fill-current" />
                  <span>View Details</span>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateY: 20 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block flex-shrink-0 perspective-[1000px]"
            >
              <div className="relative group transition-transform duration-500 hover:rotate-y-12">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000" />
                <img 
                  src={movies[0].poster_path ? `https://image.tmdb.org/t/p/w500${movies[0].poster_path}` : `https://picsum.photos/seed/${movies[0].id}/500/750`}
                  alt="Poster" 
                  className="relative rounded-2xl w-80 shadow-2xl object-cover ring-1 ring-white/10 bg-secondary"
                  onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${movies[0].id}/500/750`; }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 ${(!query && selectedGenre === 0) ? 'py-12' : 'pt-12'}`}>
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <h2 className="text-3xl font-bold">
              {query ? `Search Results for "${query}"` : 
               listType === 'top' ? 'IMDb Top 100 Movies' :
               listType === 'indian' ? 'Top Indian Movies' :
               'Discover Movies'}
            </h2>
            
            {!query && (
              <div className="flex bg-secondary/50 p-1 rounded-lg">
                <button 
                  onClick={() => { setSelectedGenre(0); fetchCategory('trending'); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${listType === 'trending' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Trending
                </button>
                <button 
                  onClick={() => { setSelectedGenre(0); fetchCategory('top'); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${listType === 'top' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Top 100
                </button>
                <button 
                  onClick={() => { setSelectedGenre(0); fetchCategory('indian'); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${listType === 'indian' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Indian Movies
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedGenre === genre.id 
                    ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            <AnimatePresence>
              {filteredMovies.map((movie, idx) => (
                <MovieCard 
                  key={`${movie.id}-${idx}`}
                  movie={movie}
                  idx={idx}
                  isWatchlisted={!!watchlist.find(m => m.id === movie.id)}
                  toggleWatchlist={toggleWatchlist}
                  getGenreName={getGenreName}
                />
              ))}
            </AnimatePresence>
            
            {filteredMovies.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center text-muted-foreground">
                <Film size={56} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium text-foreground">No movies found</p>
                <button 
                  onClick={() => {setSelectedGenre(0); setQuery(''); fetchCategory(listType);}}
                  className="mt-6 px-6 py-2 bg-secondary text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
