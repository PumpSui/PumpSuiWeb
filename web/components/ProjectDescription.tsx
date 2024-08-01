import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectRecord } from "@/type";

interface ProjectDescriptionProps {
  project: ProjectRecord;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <Card className="p-4 flex-grow shadow-md max-w-5xl">
      <CardHeader>
        <CardTitle className="text-2xl">Description</CardTitle>
      </CardHeader>
      <CardContent>{project.description}</CardContent>
    </Card>
  );
};

export default ProjectDescription;
