import React, { useCallback, useEffect, useRef, useState } from 'react';
import useInfiniteFetch from '../../hooks/useInfiniteFetch';
import Loading from '../Loading';

type WithInfiniteScrollingProps<TFetchResponse, TItem> = {
  fetchData: (page: number, signal: AbortSignal) => Promise<TFetchResponse>;
  renderItem: (item: TItem, ref?: React.Ref<HTMLDivElement>) => React.ReactNode;
  extractItems: (data: TFetchResponse) => TItem[];
  totalPages?: (data: TFetchResponse) => number;
  shouldResetData?: boolean;
};

/**
 * A higher-order component that provides infinite scrolling functionality.
 * It fetches data from the server when the user scrolls to the bottom of the page.
 * @param fetchData - A function that fetches data from the server.
 * @param renderItem - A function that renders each item in the list.
 * @param extractItems - A function that extracts items from the fetched data.
 * @param totalPages - A function that returns the total number of pages of data.
 * TFetchResponse is the fetch response from the fetchData function
 * TItem is the type of the items in the array returned by extractItems
 */

function WithInfiniteScrolling<TFetchResponse, TItem>({
  fetchData,
  renderItem,
  extractItems,
  totalPages,
  shouldResetData = false,
}: WithInfiniteScrollingProps<TFetchResponse, TItem>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasUnfetchedData, setHasUnfetchedData] = useState(true);
  const [fullData, setFullData] = useState<TItem[]>([]);

  const { data, loading, error } = useInfiniteFetch<TFetchResponse>(
    fetchData,
    currentPage
  );

  // Reset fullData and currentPage when shouldResetData is true
  useEffect(() => {
    if (shouldResetData) {
      setFullData([]);
      setCurrentPage(1);
      setHasUnfetchedData(true); // Reset hasUnfetchedData to allow fetching again
    }
  }, [shouldResetData]);

  // Keeps fullData updated and checks if there is more data to fetch
  useEffect(() => {
    if (data) {
      const items = extractItems(data);
      setFullData((prevData) => [...prevData, ...items]);

      if (totalPages && currentPage === totalPages(data)) {
        setHasUnfetchedData(false);
      }
    }
  }, [data, currentPage, extractItems, totalPages]);

  // Intersection Observer to detect when the last item is in view. Reinstantiates if loading is complete and
  // kicks off new fetch if the observer is triggered by incrementing currentPage.
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (intersectionObserver.current)
        intersectionObserver.current.disconnect();

      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasUnfetchedData) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) intersectionObserver.current.observe(node);
    },
    [loading, hasUnfetchedData]
  );

  return (
    <div>
      {fullData.map((item, index) =>
        index === fullData.length - 1
          ? renderItem(item, lastItemRef)
          : renderItem(item)
      )}
      {loading && <Loading />}
      {error && <p>Error: {error}</p>}
      {!hasUnfetchedData && <p>No more data to load.</p>}
    </div>
  );
}

export default WithInfiniteScrolling;
