import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../cssFiles/List.css'; 
import homeimg from '../logo/home.png'

function List() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchMovies();// eslint-disable-next-line 
  }, []);

  const fetchMovies = (page = 1) => {
    const apiKey = '390fb1b87a75e124ce9eb8a087baa8c8';
    const baseUrl = 'https://api.themoviedb.org/3';
    const searchUrl = '/search/movie';
    const upcomingUrl = '/movie/upcoming';

    let url;
    if (searchQuery) {
      url = `${baseUrl}${searchUrl}?api_key=${apiKey}&language=en-US&query=${searchQuery}&page=${page}`;
    } else {
      url = `${baseUrl}${upcomingUrl}?api_key=${apiKey}&language=en-US&page=${page}&sort_by=release_date.desc`;
    }

    axios.get(url)
      .then(response => {
        const newMovies = response.data.results.map(movie => ({
          ...movie,
          uniqueId: `${movie.id}-${page}`
        }));
        if (page === 1) {
          setMovies(newMovies);
        } else {
          setMovies(prevMovies => [...prevMovies, ...newMovies]);
        }
        setCurrentPage(page + 1);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const distanceToBottom = document.documentElement.offsetHeight - (window.scrollY + window.innerHeight);
      if (distanceToBottom < 100) {
        fetchMovies(currentPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };// eslint-disable-next-line 
  }, [currentPage]);

  function truncateDescription(description, lines) {
    const words = description.split(' ');
    const truncated = words.slice(0, lines * 7).join(' ');

    if (words.length > lines * 7) {
      return `${truncated} ...`;
    }
    return truncated;
  }

  useEffect(() => {
    if (searchQuery.length >= 2) {
      clearTimeout(searchTimeout);
      setSearchTimeout(
        setTimeout(() => {
          setMovies([]);
          setCurrentPage(1);
          fetchMovies(1);
        }, 300)
      );
    } else if (searchQuery.length === 0) {
      clearTimeout(searchTimeout);
      setMovies([]);
      setCurrentPage(1);
      fetchMovies(1); // Fetch upcoming movies when search query is empty
    }// eslint-disable-next-line 
  }, [searchQuery]);

  return (
    <div className="movie-list">
      <div className='movie-head'>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="search-input"
            />
          </div>
        </div>
        <Link to="/" className="back-button">
          <img src={homeimg} alt="Back to List" className="back-button-image" />
        </Link>
      </div>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <Link to={{ pathname: `/movies/${movie.id}`, state: { movie } }} key={`${movie.id}-${index}`} className="movie-tile">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={`${movie.title} Poster`}
            />
            <div className='movie-details'>
              <div className='left'>
                <h2>{movie.title} </h2>
              </div>
              <div className='right'>
                <p className="rating">({movie.vote_average})</p>
              </div>
            </div>
            <div className='bottom'>
              <p className="description">
                {truncateDescription(movie.overview, 2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default List;
