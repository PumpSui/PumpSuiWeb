// hooks/useGetInfiniteObject.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { SuiClient } from "@mysten/sui/client";
import { BareFetcher } from "swr";

export type ObjectsResponseType<T> = {
  hasNextPage: boolean;
  nextCursor: string | null;
  data: T[];
};

export function useGetInfiniteObject<T>(
  client: SuiClient,
  fetchFunction: Function,
  itemsPerPage: number = 8,
  autoLoad: boolean = true
) {
  const [objects, setObjects] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const loadingRef = useRef(false);

  const getKey = (
    pageIndex: number,
    previousPageData: ObjectsResponseType<T>
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;
    return [client, pageIndex === 0 ? null : previousPageData.nextCursor];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    ObjectsResponseType<T>,
    any
  >(
    getKey,
    fetchFunction as SWRInfiniteConfiguration<
      ObjectsResponseType<T>,
      any,
      BareFetcher<ObjectsResponseType<T>>
    >
  );

  useEffect(() => {
    if (data) {
      const allObjects = data.flatMap((page) => page.data);
      setObjects(allObjects);
      setHasNextPage(data[data.length - 1]?.hasNextPage || false);
    }
  }, [data]);

  const loadMoreIfNeeded = useCallback(async () => {
    if (loadingRef.current || !hasNextPage || isValidating) return;
    loadingRef.current = true;
    try {
      await setSize(size + 1);
    } finally {
      loadingRef.current = false;
    }
  }, [hasNextPage, isValidating, setSize, size]);

  useEffect(() => {
    if (!autoLoad) return;

    const intervalId = setInterval(() => {
      if (hasNextPage && !loadingRef.current) {
        loadMoreIfNeeded();
      } else if (!hasNextPage) {
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [loadMoreIfNeeded, hasNextPage, autoLoad]);

    useEffect(() => {
      if (!hasNextPage && data) {
        setIsAllLoaded(true);
      }
    }, [hasNextPage, data]);

  const displayedObjects = useMemo(() => {
    return objects.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [objects, currentPage, itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(objects.length / itemsPerPage),
    [objects, itemsPerPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const loadMore = useCallback(() => {
    if (hasNextPage && !isValidating) {
      loadMoreIfNeeded();
    }
  }, [hasNextPage, isValidating, loadMoreIfNeeded]);

  return {
    objects,
    displayedObjects,
    currentPage,
    totalPages,
    hasNextPage,
    error,
    isLoading: !data && !error,
    isLoadingMore: isValidating,
    isAllLoaded,
    handlePageChange,
    loadMore,
  };
}
