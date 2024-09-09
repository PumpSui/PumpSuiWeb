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
      <div className="absolute bottom-2 left-2 py-2 px-4 bg-white rounded-lg">
        <p className="text-black text-lg font-bold">{project.name}</p>
      </div>
    </div>
  );
};

export default ProjectHeader;
