import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Heart, Star, Send, User, Calendar, Clock } from 'lucide-react';
// @ts-ignore
import freekeys from 'freekeys';

import { getGenreName } from './Home';

const TMDB_API_KEY = freekeys.tmdb || "mock_key";
const BASE_URL = 'https://api.themoviedb.org/3';

import { MOCK_MOVIES } from '../data/mockMovies';

export default function MoviePage({ watchlist, toggleWatchlist }: { watchlist: any[], toggleWatchlist: (m: any) => void }) {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    
    // Load reviews
    const storedReviews = localStorage.getItem(`reviews_${id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews([]);
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [detailsRes, creditsRes, videosRes, similarRes] = await Promise.all([
        axios.get(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`),
        axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
        axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`),
        axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}`)
      ]);
      
      setMovie(detailsRes.data);
      setCast(creditsRes.data.cast.slice(0, 10)); // top 10 cast
      setVideos(videosRes.data.results.filter((v: any) => v.type === 'Trailer').slice(0, 2));
      setSimilar(similarRes.data.results.slice(0, 5));
    } catch (err) {
      console.log("API failed. Using mock data for Movie Details.", err);
      const mockMovie = MOCK_MOVIES.find(m => m.id.toString() === id);
      if (mockMovie) {
        setMovie({
          ...mockMovie,
          runtime: 120,
          budget: 150000000,
          revenue: 800000000,
          status: 'Released',
          genres: mockMovie.genre_ids.map(gid => ({ id: gid, name: getGenreName(gid) }))
        });
        
        // Mock Cast
        setCast([
          { id: 1, name: 'Leonardo DiCaprio', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg', character: 'Lead Role' },
          { id: 2, name: 'Brad Pitt', profile_path: '/cckcYc2v0yh1tc9QjRelptcOBkp.jpg', character: 'Supporting Role' },
          { id: 3, name: 'Tom Hanks', profile_path: '/xndWFsBlClOJFRdhStHQYiaSOMp.jpg', character: 'Supporting Role' },
        ]);
        
        // Mock Similar movies
        setSimilar(MOCK_MOVIES.filter(m => m.id.toString() !== id).slice(0, 4));
        setVideos([]);
      } else {
        setMovie(null);
      }
    }
    setLoading(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating!');
    if (!reviewText.trim()) return alert('Please enter a review text!');

    const newReview = {
      id: Date.now().toString(),
      rating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    
    setRating(0);
    setReviewText('');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
        <p className="text-muted-foreground mt-4">Make sure you have a valid TMDB API key to fetch IMDb-level details.</p>
        <Link to="/" className="mt-8 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full">Go Home</Link>
      </div>
    );
  }

  const isWatchlisted = !!watchlist.find(m => m.id === movie.id);

  return (
    <div className="min-h-screen pb-20">
      {/* Cinematic Header */}
      <div className="relative h-[60vh] lg:h-[75vh] w-full bg-black">
        <img 
          src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : `https://picsum.photos/seed/${movie.id}bg/1920/1080`}
          alt="Backdrop"
          className="w-full h-full object-cover opacity-40 bg-black"
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${movie.id}bg/1920/1080`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 pt-16 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 pb-12 flex flex-col md:flex-row gap-8 items-end">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : `https://picsum.photos/seed/${movie.id}/500/750`}
              alt={movie.title}
              className="w-48 md:w-64 rounded-xl shadow-2xl border border-border/20 hidden sm:block bg-secondary"
              onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${movie.id}/500/750`; }}
            />
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6">
                <span className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                  <Star size={16} className="fill-current mr-1" />
                  <span className="text-base">{movie.vote_average?.toFixed(1)}</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground"><Calendar size={16}/> {movie.release_date}</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Clock size={16}/> {movie.runtime} min</span>
                <div className="flex gap-2">
                  {movie.genres?.map((g: any) => (
                    <span key={g.id} className="bg-secondary px-3 py-1 rounded-full text-foreground border border-border">{g.name}</span>
                  ))}
                </div>
              </div>
              <p className="text-lg text-foreground/90 max-w-3xl leading-relaxed mb-6">
                {movie.overview}
              </p>
              <div className="flex gap-4">
                {videos.length > 0 && (
                  <a href={`https://www.youtube.com/watch?v=${videos[0].key}`} target="_blank" rel="noreferrer" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all">
                    <Play size={20} className="fill-current" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                <button 
                  onClick={() => toggleWatchlist(movie)}
                  className="bg-secondary/50 hover:bg-secondary text-foreground px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all border border-border backdrop-blur-md"
                >
                  <Heart size={20} className={isWatchlisted ? 'fill-primary text-primary' : ''} />
                  <span>{isWatchlisted ? 'Saved' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Top Cast */}
          {cast.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User size={24}/> Top Cast</h2>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                {cast.map(actor => (
                  <div key={actor.id} className="flex-shrink-0 w-32 bg-secondary/30 rounded-xl overflow-hidden border border-border">
                    <img 
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : `https://picsum.photos/seed/${actor.id}cast/185/278`} 
                      alt={actor.name}
                      className="w-full h-40 object-cover bg-secondary"
                      onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${actor.id}cast/185/278`; }}
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-1">{actor.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trailers */}
          {videos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Play size={24}/> Official Trailers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map(video => (
                  <div key={video.id} className="aspect-video rounded-xl overflow-hidden border border-border">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${video.key}`} 
                      title={video.name}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Review System */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Star size={24}/> User Reviews</h2>
            
            <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-8">
              <h4 className="text-lg font-semibold mb-4">Leave a review</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star size={28} className={`${(hoverRating || rating) >= s ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'} transition-colors`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="w-full bg-background border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y mb-4"
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Send size={18} /> Post Review
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-xl border border-border border-dashed">
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-background border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User size={20} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">Guest User</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                        <Star size={16} className="fill-current mr-1" />
                        <span className="text-sm font-bold">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-foreground/90 mt-2">
                      {review.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-secondary/20 border border-border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Movie Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold">{movie.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget</p>
                <p className="font-semibold">{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-semibold">{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">More Like This</h3>
              <div className="grid grid-cols-2 gap-4">
                {similar.map(sim => (
                  <Link to={`/movie/${sim.id}`} key={sim.id} className="group relative rounded-lg overflow-hidden border border-border">
                    <img 
                      src={sim.poster_path ? `https://image.tmdb.org/t/p/w342${sim.poster_path}` : `https://picsum.photos/seed/${sim.id}/342/513`} 
                      alt={sim.title}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500 bg-secondary"
                      onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${sim.id}/342/513`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-xs font-semibold line-clamp-2">{sim.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
