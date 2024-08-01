// hooks/useProjectFilters.ts
import { useState, useMemo, useCallback } from "react";
import { ProjectRecord } from "@/type";

export const useProjectFilters = (
  projects: ProjectRecord[],
  supportedProjects: string[],
  address: string | null | undefined,
) => {
  const [filterState, setFilterState] = useState({
    tab: "all",
    searchQuery: "",
    sortBy: "latest",
  });

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Filter by tab
    if (filterState.tab === "supported") {
      filtered = filtered.filter((project) =>
        supportedProjects.includes(project.id)
      );
    }
    if (filterState.tab === "created") {
      filtered = filtered.filter((project) => project.creator === address);
    }

    // Filter by search query
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }

    // Sort projects
    switch (filterState.sortBy) {
      case "latest":
        filtered.sort((a, b) => a.start_time_ms - b.start_time_ms);
        break;
      case "oldest":
        filtered.sort((a, b) => b.start_time_ms - a.start_time_ms);
        break;
      // Add more sorting options as needed
    }

    return filtered;
  }, [projects, supportedProjects, filterState]);

  const setTab = useCallback((tab: string) => {
    setFilterState((prev) => ({ ...prev, tab }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setSortBy = useCallback((sortBy: string) => {
    setFilterState((prev) => ({ ...prev, sortBy }));
  }, []);

  return {
    filteredAndSortedProjects,
    filterState,
    setTab,
    setSearchQuery,
    setSortBy,
  };
};
