import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css'; // Import your CSS file for styling

function MovieDetails() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    try {
      const apiKey = '390fb1b87a75e124ce9eb8a087baa8c8'; // Replace with your actual API key
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
    <>
    <div className='movie-header'>
        <h2>Movie Details</h2>
    </div>    
    <div className="movie-details">
      <div className="details-container">
        <div className="left">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
            alt={`${movieDetails.title} Poster`}
          />
        </div>
        <div className="info-container">
          <h2>{movieDetails.title}</h2>
          <p>Year of Release: {movieDetails.release_date.slice(0, 4)} | {formatTime(movieDetails.runtime)} | </p>
          <p>Rating: {movieDetails.vote_average}</p>
        
          <p>Duration: {formatTime(movieDetails.runtime)}</p>
          <p>Director: {movieDetails.director}</p>
          <p>Cast: {movieDetails.cast.map(actor => actor.name).join(', ')}</p>
          <p>Description: {movieDetails.overview}</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default MovieDetails;
