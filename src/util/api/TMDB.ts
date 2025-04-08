import axios from 'axios';
import { MovieResponse } from '../types';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

export async function getMovies(
  page: number = 1,
  signal: AbortSignal
): Promise<MovieResponse> {
  // IDK why I need to declare options like this instead of just passing signal directly but it doesn't work when I do it that way.
  const options = { signal: signal };
  try {
    const response = await axios.get<MovieResponse>(
      `${baseUrl}/movie/top_rated`,
      {
        params: {
          api_key: apiKey,
          page,
        },
        ...options,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}
