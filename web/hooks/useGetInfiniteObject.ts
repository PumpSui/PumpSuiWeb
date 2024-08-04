// hooks/useGetInfiniteObject.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { SuiClient } from "@mysten/sui/client";
import { BareFetcher } from "swr";
import { ObjectsResponseType } from "@/type";
import { SuiGraphQLClient } from "@mysten/sui/graphql";


export function useGetInfiniteObject<T>(
  client: SuiClient | SuiGraphQLClient<{}>,
  fetchFunction: Function,
  itemsPerPage: number = 50,
  autoLoad: boolean = true,
  cacheKey?: string,
  initialFetch: boolean = true
) {
  const [objects, setObjects] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(initialFetch);
  const loadingRef = useRef(false);

  const getKey = (
    pageIndex: number,
    previousPageData: ObjectsResponseType<T>
  ) => {
    if (!shouldFetch) return null; // 如果 shouldFetch 为 false，则不加载数据
    if (previousPageData && !previousPageData.hasNextPage) return null;
    return [
      client,
      pageIndex === 0 ? null : previousPageData?.nextCursor,
      cacheKey,
    ];
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<
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

  // 新增：手动触发数据加载的函数
  const fetchData = useCallback(() => {
    setShouldFetch(true);
    mutate();
  }, [mutate]);

  // 新增：重置数据的函数
  const resetData = useCallback(() => {
    setObjects([]);
    setHasNextPage(true);
    setIsAllLoaded(false);
    setCurrentPage(1);
    setSize(1);
    setShouldFetch(false);
  }, [setSize]);

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
    fetchData, // 新增
    resetData, // 新增
  };
}
