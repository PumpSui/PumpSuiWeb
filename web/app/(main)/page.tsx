"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  getAllDeployRecords,
  getAllProjectAdminCapGraphql,
} from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { ProjectRecord } from "@/type";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import ProjectNavbar from "@/components/project_nav";
import { useGetInfiniteObject } from "@/hooks/useGetInfiniteObject";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { PaginationComponent } from "@/components/PaginationComponent";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getAdminCap } from "@/api/suifund/graphqlContext";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const ITEMS_PER_PAGE = 8;

const ProjectCardMemo = React.memo(ProjectCard);

const Page: React.FC = () => {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecords = useCallback(
    async ([client, cursor]: [SuiClient, string | null]) => {
      return await getAllDeployRecords(client, cursor);
    },
    []
  );

  const { objects, isAllLoaded, hasNextPage, error, isLoading, loadMore } =
    useGetInfiniteObject<ProjectRecord>(client, fetchRecords, ITEMS_PER_PAGE);

  const {
    filteredAndSortedObjects,
    tab,
    searchQuery,
    sortBy,
    handleTabChange,
    handleSearch,
    handleSort,
  } = useProjectFilters(objects, currentAccount?.address);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchQuery, sortBy]);

  useEffect(() => {
    if (
      !isAllLoaded &&
      hasNextPage &&
      filteredAndSortedObjects.length < currentPage * ITEMS_PER_PAGE
    ) {
      loadMore();
    }
  }, [
    isAllLoaded,
    hasNextPage,
    filteredAndSortedObjects.length,
    currentPage,
    loadMore,
  ]);

  if (error) return <div>Failed to load</div>;
  if (isLoading && objects.length === 0) return <LoadingIndicator />;

  return (
    <ErrorBoundary>
      <main>
        <div className="py-8">
          <ProjectNavbar
            onTabChange={handleTabChange}
            onSearch={handleSearch}
            onSort={handleSort}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {pageDisplayedObjects.map((project, index) => (
              <ProjectCardMemo key={project.id} {...project} />
            ))}
          </div>
          {pageDisplayedObjects.length === 0 && <div>No projects found</div>}
          {isLoading && <LoadingIndicator />}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
};

export default Page;
