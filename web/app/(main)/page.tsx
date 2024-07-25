"use client";
import { getAllDeployRecords } from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { ProjectRecord, ProjectRecordResponse } from "@/type";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { SuiClient } from "@mysten/sui/client";

const ITEMS_PER_PAGE = 8;

const Page: React.FC = () => {
  const client = useSuiClient();
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loadingRef = useRef(false);

  const getKey = (
    pageIndex: number,
    previousPageData: ProjectRecordResponse
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;
    return [client, pageIndex === 0 ? null : previousPageData.nextCursor];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetchRecords
  );

  const totalPages = useMemo(
    () => Math.ceil(records.length / ITEMS_PER_PAGE),
    [records]
  );

  useEffect(() => {
    if (data) {
      const allRecords = data.flatMap((page) => page.data);
      setRecords(allRecords);
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
    const intervalId = setInterval(() => {
      if (hasNextPage && !loadingRef.current) {
        loadMoreIfNeeded();
      } else if (!hasNextPage) {
        clearInterval(intervalId);
      }
    }, 2000); // 每2秒检查一次

    return () => clearInterval(intervalId);
  }, [loadMoreIfNeeded, hasNextPage]);

  const displayedRecords = useMemo(() => {
    return records.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [records, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main>
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {displayedRecords.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                isActive={currentPage === 1}
                href={"#"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                  href={"#"}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                isActive={currentPage === totalPages && !hasNextPage}
                href={"#"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
};

export default Page;

async function fetchRecords([client, cursor]: [
  client: SuiClient,
  cursor: string | null
]) {
  const result = await getAllDeployRecords(client, cursor);
  return result;
}
