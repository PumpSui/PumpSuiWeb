// hooks/useProjectFilters.ts
import { useState, useMemo } from "react";
import { ProjectRecord } from "@/type";

export const useProjectFilters = (
  objects: ProjectRecord[],
  currentUserAddress?: string
) => {
  const [tab, setTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredAndSortedObjects = useMemo(() => {
    let result = [...objects];

    // Apply filtering
    if (tab === "supported") {
      // Filter for supported projects
      // result = result.filter(project => project.isSupported);
    } else if (tab === "created") {
      result = result.filter(
        (project) => project.creator === currentUserAddress
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
  }, [objects, tab, searchQuery, sortBy, currentUserAddress]);

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  return {
    filteredAndSortedObjects,
    tab,
    searchQuery,
    sortBy,
    handleTabChange,
    handleSearch,
    handleSort,
  };
};
