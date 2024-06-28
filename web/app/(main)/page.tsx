'use client';

import Navbar from "@/components/navbar";
import ProjectCard, { Project } from "@/components/project_card";
import "@mysten/dapp-kit/dist/index.css";

const page = () => {
  const projects: Project[] = [
    {
      creator: 'alice',
      name: 'Project 01',
      progress: 50,
      startDate: '2024/06/05 12:00:00',
      endDate: '2024/08/08 12:00:00',
      description: 'This project is to do something',
    },
        {
      creator: 'bob',
      name: 'Project 02',
      progress: 30,
      startDate: '2024/07/01 09:00:00',
      endDate: '2024/09/01 17:00:00',
      description: 'Another project with a different goal',
    },
    {
      creator: 'bob',
      name: 'Project 03',
      progress: 80,
      startDate: '2024/07/01 09:00:00',
      endDate: '2024/09/01 17:00:00',
      description: 'Another project with a different goal',
    }
  ];
    return (
      <main>
        <Navbar></Navbar>
        <div className="min-h-screen py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                creator={project.creator}
                name={project.name}
                progress={project.progress}
                startDate={project.startDate}
                endDate={project.endDate}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </main>
    );
}

export default page