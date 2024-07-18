// components/ProjectDetailItem.tsx
import React from "react";

interface ProjectDetailItemProps {
  label: string;
  value: string;
}

const ProjectDetailItem: React.FC<ProjectDetailItemProps> = ({
  label,
  value,
}) => (
  <div className="flex justify-between">
    <p>{label}:</p>
    <p className="text-cyan-400">{value}</p>
  </div>
);

export default ProjectDetailItem;
