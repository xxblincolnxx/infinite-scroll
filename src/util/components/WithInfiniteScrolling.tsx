import React, { useCallback, useEffect, useRef, useState } from 'react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

type WithInfiniteScrollingProps<T, ItemType> = {
  fetchData: (page: number, signal: AbortSignal) => Promise<T>;
  renderItem: (
    item: ItemType,
    ref?: React.Ref<HTMLDivElement>
  ) => React.ReactNode;
  extractItems: (data: T) => ItemType[];
  totalPages?: (data: T) => number;
};

function WithInfiniteScrolling<T, ItemType>({
  fetchData,
  renderItem,
  extractItems,
  totalPages,
}: WithInfiniteScrollingProps<T, ItemType>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasUnfetchedData, setHasUnfetchedData] = useState(true);
  const [fullData, setFullData] = useState<ItemType[]>([]);

  const { data, loading, error } = useInfiniteScroll<T>(fetchData, currentPage);

  useEffect(() => {
    if (data) {
      const items = extractItems(data);
      setFullData((prevData) => [...prevData, ...items]);

      if (totalPages && currentPage === totalPages(data)) {
        setHasUnfetchedData(false);
      }
    }
  }, [data, currentPage, extractItems, totalPages]);

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
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!hasUnfetchedData && <p>No more data to load.</p>}
    </div>
  );
}

export default WithInfiniteScrolling;
