"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { ProjectListView } from "@/components/ProjectListView";
import { useProjectsData } from "@/hooks/useProjectsData";
import { useProjectFilters } from "@/hooks/useProjectFilters";

const ITEMS_PER_PAGE = 8;

const Page: React.FC = () => {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    projects,
    supportedProjects,
    isLoading,
    error,
    loadMore,
    fetchSupportedData,
  } = useProjectsData(client, currentAccount?.address);

  const {
    filteredAndSortedProjects,
    filterState,
    setTab,
    setSearchQuery,
    setSortBy,
  } = useProjectFilters(projects, supportedProjects,currentAccount?.address);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterState]);

  const handleTabChange = useCallback(
    (value: string) => {
      setTab(value);
      if (value === "supported") {
        fetchSupportedData();
      }
    },
    [setTab, fetchSupportedData]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleSort = useCallback(
    (sortBy: string) => {
      setSortBy(sortBy);
    },
    [setSortBy]
  );

  return (
      <main>
        <div className="py-8">
          <ProjectListView
            projects={filteredAndSortedProjects}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={isLoading}
            onTabChange={handleTabChange}
            onSearch={handleSearch}
            onSort={handleSort}
            onPageChange={setCurrentPage}
            onLoadMore={loadMore}
          />
        </div>
      </main>
  );
};

export default Page;
