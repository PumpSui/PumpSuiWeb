'use client';

import ProjectCard from "@/components/project_card";
import { projects } from "@/mock";
import "@mysten/dapp-kit/dist/index.css";


const page = () => {
    return (
      <main>
        <div className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                creator={project.creator}
                name={project.name}
                progress={project.progress}
                startDate={project.startDate}
                endDate={project.endDate}
                description={project.description}
                imgUrl={project.imgUrl}
              />
            ))}
          </div>
        </div>
      </main>
    );
}

export default page