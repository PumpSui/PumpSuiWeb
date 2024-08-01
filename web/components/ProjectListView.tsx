// components/ProjectListView.tsx
import React from "react";
import { ProjectRecord } from "@/type";
import ProjectNavbar from "@/components/project_nav";
import { PaginationComponent } from "@/components/PaginationComponent";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import ProjectCard from "@/components/project_card";

interface ProjectListViewProps {
  projects: ProjectRecord[];
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  onTabChange: (value: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  currentPage,
  itemsPerPage,
  isLoading,
  onTabChange,
  onSearch,
  onSort,
  onPageChange,
  onLoadMore,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageDisplayedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  return (
    <>
      <ProjectNavbar
        onTabChange={onTabChange}
        onSearch={onSearch}
        onSort={onSort}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {pageDisplayedProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      {pageDisplayedProjects.length === 0 && <div>No projects found</div>}
      {isLoading && <LoadingIndicator />}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      {projects.length >= currentPage * itemsPerPage && (
        <button onClick={onLoadMore}>Load More</button>
      )}
    </>
  );
};
