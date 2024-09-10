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
  <div className="flex justify-between gap-5 items-center text-black text-sm font-extralight">
    <p>{label}</p>
    <p>{value}</p>
  </div>
);

export default ProjectDetailItem;
