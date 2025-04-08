import { getMovies } from '../api/TMDB';
import { Movie, MovieResponse } from '../types';
import WithInfiniteScrolling from './HOC/WithInfiniteScrolling';
import ScrollItem from './ScrollItem';
import { v4 as uuidv4 } from 'uuid';

export default function ScrollContainer() {
  return (
    <WithInfiniteScrolling<MovieResponse, Movie>
      fetchData={getMovies}
      extractItems={(data) => data.results}
      totalPages={(data) => data.total_pages}
      renderItem={(movie, ref) => (
        <ScrollItem key={uuidv4()} movie={movie} ref={ref} />
      )}
    />
  );
}
