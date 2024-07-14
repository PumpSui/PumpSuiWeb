import { Progress } from "../ui/progress";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import { getRealDate } from "@/lib/utils";
import { useProject } from "../providers/ProjectContext";

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
      <Card
        onClick={handleCardOnClick}
        className={`${
          !project.isDetail
            ? "hover:outline hover:outline-2 hover:rounded-2xl hover:cursor-pointer active:bg-primary-foreground"
            : ""
        } p-4 max-w-sm bg-secondary rounded-2xl`}
      >
        <div className="flex flex-col h-full">
          {!project.isDetail && project.image_url && (
            <div className="">
              <Image
                src={project.image_url}
                alt="Project Image"
                width={500}
                height={1}
                className="rounded-2xl"
              />
            </div>
          )}
          <div className="flex-grow">
            <CardHeader>
              <CardTitle className="truncate text-lg font-semibold">
                Created by @{project.creator}
              </CardTitle>
              <CardTitle className="text-xl">Name: {project.name}</CardTitle>
            </CardHeader>
            <CardContent className="mt-2">
              <div className="flex justify-center gap-5 mb-4">
                <p className="font-semibold">Progress:</p>
                <Progress
                  value={(1 - project.remain / project.total_supply) * 100}
                  className="w-full self-center min-h-4 bg-primary-foreground rounded-lg"
                />
              </div>
              <div className="text-sm text-cyan-400">
                <div className="flex justify-between">
                  <p>START:</p>
                  <p>{getRealDate(project.start_time_ms)}</p>
                </div>
                <div className="flex justify-between">
                  <p>END:</p>
                  <p>{getRealDate(project.end_time_ms)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Description:</p>
                <p className="text-cyan-400">{project.description}</p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
  );
};

export default ProjectCard;
