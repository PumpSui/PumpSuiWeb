// context/ProjectContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
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
  const value = useMemo(
    () => ({ selectedProject, setSelectedProject }),
    [selectedProject]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
