import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: any;
  idx: number;
  isWatchlisted: boolean;
  toggleWatchlist: (m: any) => void;
  getGenreName: (id: number) => string;
}

export default function MovieCard({ movie, idx, isWatchlisted, toggleWatchlist, getGenreName }: MovieCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: idx * 0.05 }}
      className="group relative flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary mb-3 border border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:border-primary/30">
        <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://picsum.photos/seed/${movie.id}/500/750`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-secondary"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${movie.id}/500/750`; }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button 
              onClick={(e) => { e.preventDefault(); toggleWatchlist(movie); }}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors z-10"
            >
              <Heart size={18} className={isWatchlisted ? 'fill-primary text-primary' : ''} />
            </button>
          </div>
          
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {movie.genre_ids.slice(0, 2).map((gId: number) => (
                  <span key={gId} className="text-[10px] uppercase tracking-wider font-semibold bg-primary/80 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {getGenreName(gId)}
                  </span>
                ))}
              </div>
            )}
            <Link 
              to={`/movie/${movie.id}`}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-medium text-sm flex justify-center items-center space-x-2 transition-colors"
            >
              <Play size={14} className="fill-current" />
              <span>View Details</span>
            </Link>
          </div>
        </div>
      </div>
      
      <Link to={`/movie/${movie.id}`} className="px-1 flex-1 flex flex-col hover:opacity-80">
        <h3 className="font-semibold text-[15px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {movie.title || movie.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-muted-foreground">
            {movie.release_date?.split('-')[0] || 'TBA'}
          </span>
          <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span className="text-xs font-bold">{movie.vote_average?.toFixed(1) || 'NR'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
