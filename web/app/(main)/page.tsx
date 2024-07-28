// pages/YourPage.tsx
"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { getAllDeployRecords } from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { ProjectRecord } from "@/type";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { SuiClient } from "@mysten/sui/client";
import ProjectNavbar from "@/components/project_nav";
import { useGetInfiniteObject } from "@/hooks/useGetInfiniteObject";

const ITEMS_PER_PAGE = 8;

const Page: React.FC = () => {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [tab, setTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecords = useCallback(
    async ([client, cursor]: [SuiClient, string | null]) => {
      return await getAllDeployRecords(client, cursor);
    },
    []
  );

  const {
    displayedObjects,
    objects,
    isAllLoaded,
    hasNextPage,
    error,
    isLoading,
  } = useGetInfiniteObject<ProjectRecord>(client, fetchRecords, ITEMS_PER_PAGE);

  const filteredAndSortedObjects = useMemo(() => {
    if (!isAllLoaded) return displayedObjects;

    let result = [...objects];

    // Apply filtering
    if (tab === "supported") {
      // Filter for supported projects
      // result = result.filter(project => project.isSupported);
    } else if (tab === "created") {
      result = result.filter(
        (project) => project.creator === currentAccount?.address
      );
    }

    if (searchQuery) {
      result = result.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => b.start_time_ms - a.start_time_ms);
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.start_time_ms - b.start_time_ms);
    }

    return result;
  }, [isAllLoaded, displayedObjects, objects, tab, searchQuery, sortBy, currentAccount?.address]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchQuery, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedObjects.length / ITEMS_PER_PAGE);
  }, [filteredAndSortedObjects]);

  const pageDisplayedObjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedObjects.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedObjects, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchQuery, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <div className="py-8">
        <ProjectNavbar
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          onSort={handleSort}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {pageDisplayedObjects.map((project, index) => (
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
                isActive={currentPage === totalPages}
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
