import { getMovies } from '../api/TMDB';
import { Movie, MovieResponse } from '../types';
import WithInfiniteScrolling from './WithInfiniteScrolling';
import ScrollItem from './ScrollItem';

export default function ScrollContainer() {
  return (
    <WithInfiniteScrolling<MovieResponse, Movie>
      fetchData={getMovies}
      extractItems={(data) => data.results}
      totalPages={(data) => data.total_pages}
      renderItem={(movie, ref) => (
        <ScrollItem key={movie.id} movie={movie} ref={ref} />
      )}
    />
  );
}
