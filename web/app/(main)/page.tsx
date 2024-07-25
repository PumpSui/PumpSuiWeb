"use client";
import { getAllDeployRecords } from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { ProjectRecord } from "@/type";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { SuiClient } from "@mysten/sui/client";

const ITEMS_PER_PAGE = 8;

const Page: React.FC = () => {
  const client = useSuiClient();
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;
    return [client, pageIndex === 0 ? null : previousPageData.nextCursor];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetchRecords
  );

  useEffect(() => {
    if (data) {
      const allRecords = data.flatMap((page) => page.data);
      setRecords(allRecords);
      setTotalPages(Math.ceil(allRecords.length / ITEMS_PER_PAGE));
    }
  }, [data]);

  useEffect(() => {
    // 如果当前页面是最后一页，并且还有更多数据可以加载，则加载下一页
    if (
      currentPage === totalPages &&
      data &&
      data[data.length - 1]?.hasNextPage
    ) {
      setSize(size + 1);
    }
  }, [currentPage, totalPages, data, size, setSize]);

  const displayedRecords = records.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                isActive={currentPage === 1} href={"#"}              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1} href={"#"}                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                isActive={currentPage === totalPages} href={"#"}              />
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
  cursor: string
]) {
  const result = await getAllDeployRecords(client, cursor);
  return result;
}
