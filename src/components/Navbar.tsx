import React from 'react';
import { Search, Film, Heart, Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  query: string;
  setQuery: (q: string) => void;
  searchMovies: (e: React.FormEvent) => void;
  isDark: boolean;
  toggleTheme: () => void;
  watchlistCount: number;
}

export default function Navbar({ query, setQuery, searchMovies, isDark, toggleTheme, watchlistCount }: NavbarProps) {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies(e);
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary cursor-pointer">
          <Film size={28} />
          <span className="text-xl font-bold tracking-tight hidden sm:block">IMDbClone</span>
        </Link>
        
        <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-4 sm:mx-8 relative">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors">
            <Search size={20} />
          </button>
        </form>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link 
            to="/watchlist"
            className="relative p-2 rounded-full hover:bg-secondary transition-colors group"
            title="Watchlist"
          >
            <Heart size={24} className="text-muted-foreground group-hover:text-primary" />
            {watchlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                {watchlistCount}
              </span>
            )}
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
