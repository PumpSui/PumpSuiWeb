"use client";

import { getAllDeployRecords } from "@/api/suifund";
import ProjectCard from "@/components/project_card";
import { Button } from "@/components/ui/button";
import { projects } from "@/mock";
import { ProjectRecord } from "@/type";
import { useSuiClient } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const client = useSuiClient();
  async function handleTestBtnClick() {
    const data = await getAllDeployRecords(client);
    console.log(data);
  }
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  useEffect(() => {
    getAllDeployRecords(client).then((data) => {
      setRecords(data);
    });
  }, [client]);
  return (
    <main>
      <Button onClick={handleTestBtnClick}>Test</Button>
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4">
          {records.map((project, index) => (
            <ProjectCard
              key={index}
              creator={project.creator}
              name={project.name}
              progress={project.ratio}
              startDate={project.start_time_ms.toString()}
              endDate={project.end_time_ms.toString()}
              description={project.description}
              imgUrl={project.image_url}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
