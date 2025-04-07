import axios from 'axios';

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

export async function tmdbGet<T, R>(endpoint: string, params?: T): Promise<R> {
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      params: {
        api_key: apiKey,
        ...(params && { ...params }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
