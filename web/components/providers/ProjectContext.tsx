// context/ProjectContext.tsx
import React, { createContext, useContext, useState } from "react";
import { ProjectRecord } from "@/type";

interface ProjectContextType {
  selectedProject: ProjectRecord | null;
  setSelectedProject: React.Dispatch<
    React.SetStateAction<ProjectRecord | null>
  >;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null
  );

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
