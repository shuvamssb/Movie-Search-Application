import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../cssFiles/MovieDetails.css'; 
import homeimg from '../logo/home.png'

function MovieDetails() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    fetchMovieDetails();// eslint-disable-next-line 
  }, []);

  function truncateDescription(description, lines) {
    const words = description.split(' ');
    const truncated = words.slice(0, lines * 2).join(' ');

    if (words.length > lines * 7) {
      return `${truncated} ...`;
    }
    return truncated;
  }
  const fetchMovieDetails = async () => {
    try {
      const apiKey = '390fb1b87a75e124ce9eb8a087baa8c8';
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
      const cast = creditsResponse.data.cast;
      const crew = creditsResponse.data.crew;

      const director = crew.find(member => member.job === 'Director');

      const formattedMovieDetails = {
        ...response.data,
        cast,
        director: director ? director.name : 'Not available',
      };

      setMovieDetails(formattedMovieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className='movie-details-page'>
       <div className='movie-header'>
       <h2>Movie Details</h2>
        <Link to="/" className="back-button">
          <img src={homeimg} alt="Back to List" className="back-button-image" />
        </Link>
 
      </div>
      <div className="movie-details-info">
        <div className="photo">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
            alt={`${movieDetails.title} Poster`}
          />
        </div>

        <div className="info-container">
          <h2>
            {movieDetails.title}
            <div className='Rating'> ({movieDetails.vote_average}) </div>
          </h2>
          <p>
            {movieDetails.release_date.slice(0, 4)} | {formatTime(movieDetails.runtime)} | {movieDetails.director}
          </p>
          <p>Cast: {truncateDescription(movieDetails.cast.map(actor => actor.name).join(', '), 2)}</p>
          <p>Description: {movieDetails.overview}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
