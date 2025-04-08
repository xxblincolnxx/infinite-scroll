import { useEffect, useState } from 'react';

export default function useInfiniteScroll<T>(
  fetchData: (page: number, signal: AbortSignal) => Promise<T>,
  page: number
) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchMoreData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchData(page, signal);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMoreData();
    return () => {
      abortController.abort();
    };
  }, [fetchData, page]);

  return { data, loading, error };
}
