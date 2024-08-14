// hooks/useTicketsData.ts
import { useState, useCallback, useEffect, useMemo } from "react";
import { SuiClient } from "@mysten/sui/client";
import { useGetInfiniteObject } from "@/hooks/useGetInfiniteObject";
import { getAllSupportTicket } from "@/api/suifund";
import { ProjectReward } from "@/type";

export const useTicketsData = (
  client: SuiClient,
  address?: string,
  ticketsPerPage: number = 50
) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSupported = useCallback(
    async ([client, cursor]: [SuiClient, string | null]) =>
      address
        ? getAllSupportTicket(client, address, cursor)
        : { data: [], hasNextPage: false, nextCursor: null },
    [address]
  );

  const {
    objects: allTickets,
    error,
    isLoading,
    loadMore: loadMoreOriginal,
    fetchData,
    resetData,
  } = useGetInfiniteObject<ProjectReward>(
    client,
    fetchSupported,
    ticketsPerPage,
    true,
    "tickets",
    false
  );

  const refreshData = useCallback(async () => {
    setSelectedProject(null); // 重置选中的项目
    setCurrentPage(1); // 重置当前页面
    await resetData();
    await fetchData();
  }, [resetData, fetchData]);

  const filteredTickets = useMemo(() => {
    return selectedProject
      ? allTickets.filter((item) => item.name === selectedProject)
      : allTickets;
  }, [allTickets, selectedProject]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    return filteredTickets.slice(startIndex, startIndex + ticketsPerPage);
  }, [filteredTickets, currentPage, ticketsPerPage]);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      loadMoreOriginal();
    }
  }, [currentPage, totalPages, loadMoreOriginal]);

  useEffect(() => {
    fetchData();
  }, [fetchData, address]);

  return {
    tickets: paginatedTickets,
    allTickets: filteredTickets,
    isLoading,
    error,
    loadMore,
    refreshData,
    selectedProject,
    setSelectedProject,
    currentPage,
    setCurrentPage,
    totalPages,
    hasNextPage:
      filteredTickets.length > currentPage * ticketsPerPage ||
      allTickets.length > filteredTickets.length,
  };
};
