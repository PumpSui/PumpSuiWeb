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
  isAutoLoad?: boolean;
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
  isAutoLoad = true,
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
    <div className="w-full">
      <ProjectNavbar
        onTabChange={onTabChange}
        onSearch={onSearch}
        onSort={onSort}
      />
      <div className="w-full flex justify-center">
        <div className="flex justify-between w-full p-2 my-10">
          {pageDisplayedProjects.map((project) => (
            <ProjectCard key={project.id} {...project}  />
          ))}
        </div>
      </div>
      {isLoading && <LoadingIndicator />}
      {!isLoading && projects.length === 0 && (
        <>
          <div className="flex justify-center">
            <div className="space-y-20">
              <h2 className="text-5xl">WHAT ARE YOU WAITING FOR?</h2>
              <h2 className="text-6xl">CLICK CREATE ABOVE AND</h2>
              <h2 className="text-7xl">LETS Boom Movement TOGETHER !!!</h2>
            </div>
          </div>
        </>
      )}
      {projects.length !== 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      {!isAutoLoad && projects.length >= currentPage * itemsPerPage && (
        <button onClick={onLoadMore}>Load More</button>
      )}
    </div>
  );
};
