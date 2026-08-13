import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
// @ts-ignore
import freekeys from 'freekeys';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoviePage from './pages/MoviePage';

const TMDB_API_KEY = freekeys.tmdb || "mock_key";
const BASE_URL = 'https://api.themoviedb.org/3';

// Large mock data set (same as before)
import { MOCK_MOVIES } from './data/mockMovies';

export default function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [listType, setListType] = useState('trending'); // 'trending', 'top', 'indian'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    
    fetchCategory('trending');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const fetchCategory = async (type: string) => {
    setLoading(true);
    setQuery('');
    setListType(type);
    
    try {
      let urls: string[] = [];
      if (type === 'trending') {
        urls = [
          `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=1`,
          `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=2`
        ];
      } else if (type === 'top') {
        // Fetch 5 pages for Top 100
        urls = Array.from({length: 5}, (_, i) => `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${i+1}`);
      } else if (type === 'indian') {
        // Fetch 3 pages of Indian movies
        urls = Array.from({length: 3}, (_, i) => `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=IN&sort_by=popularity.desc&page=${i+1}`);
      }
      
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const combined = responses.flatMap(r => r.data.results);
      
      // Filter unique
      const unique = Array.from(new Map(combined.map((item: any) => [item.id, item])).values());
      setMovies(unique as any[]);
    } catch (err) {
      console.log('Using mock data, API key failed or invalid');
      let mockRes = MOCK_MOVIES;
      if (type === 'indian') {
        mockRes = MOCK_MOVIES.filter(m => m.id > 100 && m.id < 200);
      } else if (type === 'top') {
        mockRes = MOCK_MOVIES.filter(m => m.vote_average > 8.4);
      }
      setMovies(mockRes);
    }
    setLoading(false);
  };

  const searchMovies = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return fetchCategory(listType);
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
      setMovies(res.data.results);
    } catch (err) {
      console.log('Search failed, filtering mock data');
      setMovies(MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase())));
    }
    setLoading(false);
  };

  const toggleWatchlist = (movie: any) => {
    let updated;
    if (watchlist.find(m => m.id === movie.id)) {
      updated = watchlist.filter(m => m.id !== movie.id);
    } else {
      updated = [...watchlist, movie];
    }
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <Navbar 
        query={query}
        setQuery={setQuery}
        searchMovies={searchMovies}
        isDark={isDark}
        toggleTheme={toggleTheme}
        watchlistCount={watchlist.length}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              movies={movies} 
              loading={loading} 
              query={query} 
              setQuery={setQuery}
              watchlist={watchlist} 
              toggleWatchlist={toggleWatchlist}
              listType={listType}
              fetchCategory={fetchCategory}
            />
          } 
        />
        <Route 
          path="/movie/:id" 
          element={<MoviePage watchlist={watchlist} toggleWatchlist={toggleWatchlist} />} 
        />
      </Routes>
    </div>
  );
}
