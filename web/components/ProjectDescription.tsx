import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectRecord } from "@/type";
import ReactMarkdown from "react-markdown";
import {doc} from "@/mock/doc"

interface ProjectDescriptionProps {
  project: ProjectRecord;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <Card className="p-4 flex-grow shadow-md max-w-5xl max-h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Description</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow prose-invert prose-sm max-w-none">
        <ReactMarkdown className={"pointer-events-none"}>
          {project.description}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default ProjectDescription;
