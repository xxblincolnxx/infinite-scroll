import { useCallback, useEffect, useRef, useState } from 'react';
import { getMovies } from '../api/TMDB';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Movie, MovieResponse } from '../types';
import Loading from './Loading';
import ScrollItem from './ScrollItem';
import { v4 as uuidv4 } from 'uuid';

export default function ScrollContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasUnfetchedData, setHasUnfetchedData] = useState(true);
  const [fullData, setFullData] = useState<Movie[]>([]);

  const { data, loading, error } = useInfiniteScroll<MovieResponse>(
    getMovies,
    currentPage
  );

  useEffect(() => {
    if (currentPage === data?.total_pages) {
      setHasUnfetchedData(false);
    }
    if (data) {
      setFullData((prevData) => [...prevData, ...data.results]);
    }
  }, [currentPage, data]);

  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (movie: HTMLDivElement | null) => {
      if (loading) return;
      if (intersectionObserver.current)
        intersectionObserver.current.disconnect();

      intersectionObserver.current = new IntersectionObserver((movies) => {
        if (movies[0].isIntersecting && hasUnfetchedData) {
          console.log('page changed');
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (movie) intersectionObserver.current.observe(movie);
    },
    [loading, hasUnfetchedData]
  );

  const scrollItems = fullData?.map((movie, i) => {
    const key = uuidv4();
    if (i === fullData.length - 1) {
      return <ScrollItem key={key} movie={movie} ref={lastItemRef} />;
    } else {
      return <ScrollItem key={key} movie={movie} />;
    }
  });

  return (
    <div>
      <p>PARTIALLY FETCHED:</p>
      {scrollItems}
      {loading && <Loading />}
      {error && <p>Error: {error}</p>}
      {!hasUnfetchedData && <h1>NO MORE DATA!</h1>}
    </div>
  );
}
