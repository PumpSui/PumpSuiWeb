"use client";

import { getAllDeployRecords } from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { ProjectRecord } from "@/type";
import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const client = useSuiClient();
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  useEffect(() => {
    getAllDeployRecords(client).then((data) => {
      setRecords(data);
    });
  }, [client]);
  return (
    <main>
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {records.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
