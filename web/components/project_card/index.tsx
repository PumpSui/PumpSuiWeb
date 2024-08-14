import { ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import { getRealDate } from "@/lib/utils";
import { useProject } from "../providers/ProjectContext";
import CardSVG from "./components/CardSVG";

interface ProjectCardProps extends ProjectRecord {
  isDetail?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = (project) => {
  const router = useRouter();
  const { setSelectedProject } = useProject();

  const handleCardOnClick = () => {
    setSelectedProject(project);
    !project.isDetail && router.push(`/project/${project.id}`);
  };

  return (
    <div
      onClick={handleCardOnClick}
      className={`group hover:scale-105 hover:cursor-pointer ease-in-out duration-300`}
    >
      <div
        className={`group-hover:brightness-150 group-hover:contrast-125 group-hover:saturate-150`}
      >
        <CardSVG
          projectImg={project.image_url || "/images/DemoProject.png"}
          project={project}
          getRealDate={getRealDate}
        ></CardSVG>
      </div>
    </div>
  );
};

export default ProjectCard;
