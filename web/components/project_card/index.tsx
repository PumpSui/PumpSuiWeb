import { ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import { getRealDate } from "@/lib/utils";
import { useProject } from "../providers/ProjectContext";
import Image from "next/image";
import CardSVG from "./components/CardSVG";
import ProjectImage from "./components/ProjectImage";
import { Progress } from "../ui/progress";

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
        className={`group-hover:brightness-125 group-hover:contrast-125 group-hover:saturate-125`}
      >
        <div className="relative w-[261px] h-[408px] bg-gradient-to-b from-blue-100 to-blue-300 from-60% rounded-xl p-2 flex flex-col items-center gap-y-3">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[26px] bg-blue-100 rounded-b-lg flex items-end justify-center z-50">
            <p className="text-black text-[10px] truncate p-1">@{project.creator}</p>
          </div>
          <div className="relative w-[245px] h-[245px]">
            <Image
              src={project.image_url || "/images/DemoProject.png"}
              alt="Project Image"
              fill
              style={{
                objectFit: "cover",
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center w-full gap-y-1">
            <p className="text-black text-xl font-bold truncate self-start pl-2">{project.name}</p>
            <div className="flex justify-between w-full px-2">
              <p className="text-black text-sm truncate">Start: </p>
              <p className="text-black text-sm truncate">{getRealDate(project.start_time_ms)}</p>
            </div>
            <div className="flex justify-between w-full px-2">
              <p className="text-black text-sm truncate">End: </p>
              <p className="text-black text-sm truncate">{getRealDate(project.end_time_ms)}</p>
            </div>
          </div>
          <div className="self-end w-full mt-auto">
            <Progress
              value={(1 - project.remain / project.total_supply) * 100}
              className="w-full self-center min-h-4"
              indicatorColor="bg-green-500 rounded-lg shadow-2xl transform"
              threshhold={project.threshold_ratio}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
