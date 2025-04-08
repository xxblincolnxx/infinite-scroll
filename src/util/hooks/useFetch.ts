/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';

type UseFetchOptions<TResponse, TExtracted> = {
  extractData?: (data: TResponse) => TExtracted;
  config?: any;
};

function useFetch<TResponse, TExtracted = TResponse>(
  url: string,
  options?: UseFetchOptions<TResponse, TExtracted>
) {
  const { extractData, config } = options || {};
  const [data, setData] = useState<TExtracted | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<TResponse>(url, {
          ...config,
          signal,
        });
        const extractedData = extractData
          ? extractData(response.data)
          : response.data;
        if (extractedData as TExtracted) {
          setData(extractedData as TExtracted);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, extractData, config]);

  return { data, loading, error };
}

export default useFetch;
