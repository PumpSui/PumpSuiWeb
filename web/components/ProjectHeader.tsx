import React from "react";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import { ProjectRecord } from "@/type";

interface ProjectHeaderProps {
  project: ProjectRecord;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
      <ProjectImage imageUrl={project.image_url} height={320} />
    </div>
  );
};

export default ProjectHeader;
