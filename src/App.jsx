import { useEffect, useState } from 'react';
import './styles-1.css';

// API key is saved elsewhere
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const url = searchQuery
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [searchQuery]);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.popularity - a.popularity;
    }
    if (sortBy === "rating") {
      return b.vote_average - a.vote_average;
    }
    if (sortBy === "release_date") {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return 0;
  });

  return (
    <div>
      <header className="app-header">
        <h1>Movie Explorer</h1>
      </header>

      <section className="controls-container">
        <input type="text" placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort By</option>
        <option value="popularity">Popularity</option>
        <option value="rating">Rating</option>
        <option value="release_date">Release Date</option>
      </select>
    </section>

    <main className="movie-grid">
      {sortedMovies.map((movie) => (
        <div className="movie-card" key={movie.id}>
          <img
            className="movie-poster"
            src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'placeholder.jpg'}
            alt={movie.title}
          />
        
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-release-date">Release Date: {movie.release_date || "N/A"}</p>
          <p className="movie-rating">Rating: {movie.vote_average || "N/A"}</p>
        </div>
      </div>
    ))}
    </main>
    </div>
  );
}

export default App;