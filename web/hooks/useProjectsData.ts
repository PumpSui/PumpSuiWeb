// hooks/useProjectData.ts
import { useCallback } from "react";
import { SuiClient } from "@mysten/sui/client";
import { useGetInfiniteObject } from "@/hooks/useGetInfiniteObject";
import { getAllDeployRecords, getSupportedProjects } from "@/api/suifund";
import { ProjectRecord } from "@/type";

export const useProjectsData = (client: SuiClient, address?: string) => {
  const fetchRecords = useCallback(
    async ([client, cursor]: [SuiClient, string | null]) =>
      getAllDeployRecords(client, cursor),
    []
  );

  const fetchSupported = useCallback(
    async ([client, cursor]: [SuiClient, string | null]) =>
      address
        ? getSupportedProjects(client, address, cursor)
        : { data: [], hasNextPage: false, nextCursor: null },
    [address]
  );

  const {
    objects: projects,
    error,
    isLoading,
    loadMore,
  } = useGetInfiniteObject<ProjectRecord>(
    client,
    fetchRecords,
    50,
    true,
    "deployRecords"
  );

  const { objects: supportedProjects, fetchData: fetchSupportedData } =
    useGetInfiniteObject<string>(
      client,
      fetchSupported,
      50,
      false,
      "supportedProjects",
      false
    );

  return {
    projects,
    supportedProjects,
    isLoading,
    error,
    loadMore,
    fetchSupportedData,
  };
};
