import React, { useEffect, useState } from "react";
import "./movie.css";

const API_KEY = "e79d8cb91da22840b1ca865b87e709f5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [language, setLanguage] = useState("ta");

  useEffect(() => {
    const fetchData = async () => {
      const url =
        language === "ta"
          ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=ta&sort_by=popularity.desc&page=${page}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    };
    fetchData();
  }, [page, language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setPage(1);
  };

  return (
    <div>
      <h2 className="heading">Movie Details</h2>

      <div className="filter-tabs">
        <button
          className={`filter-btn ${language === "ta" ? "active" : ""}`}
          onClick={() => handleLanguageChange("ta")}
        >
          Tamil Movies
        </button>
        <button
          className={`filter-btn ${language === "all" ? "active" : ""}`}
          onClick={() => handleLanguageChange("all")}
        >
          All Movies
        </button>
      </div>

      <div className="movie-card">
        {movies?.map((item) => (
          <div key={item.id} className="movie">
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title}
              className="movie-poster"
            />
            <h2>{item.title}</h2>
            <p>
              <strong>Release:</strong> {item.release_date}
            </p>
            <p>
              <strong>Rating:</strong> {item.vote_average}
            </p>
            <p className="overview">{item.overview}</p>
            <button className="btn" onClick={() => setSelectedMovie(item)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="Page">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>
            <div className="modal-body">
              <img
                src={`${IMAGE_BASE_URL}${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="modal-poster"
              />
              <div className="modal-info">
                <h2>{selectedMovie.title}</h2>
                {selectedMovie.original_title !== selectedMovie.title && (
                  <p className="original-title">
                    <em>Original Title: {selectedMovie.original_title}</em>
                  </p>
                )}
                <p>
                  <strong>Release Date:</strong> {selectedMovie.release_date}
                </p>
                <p>
                  <strong>Rating:</strong> ⭐ {selectedMovie.vote_average} / 10
                  ({selectedMovie.vote_count} votes)
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {selectedMovie.original_language?.toUpperCase()}
                </p>
                <p>
                  <strong>Popularity:</strong> {selectedMovie.popularity}
                </p>
                <div className="modal-overview">
                  <strong>Overview:</strong>
                  <p>{selectedMovie.overview || "No overview available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
