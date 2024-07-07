import { Progress } from "../ui/progress";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Project } from "@/type";


const ProjectCard: React.FC<Project> = ({
  creator,
  name,
  progress,
  startDate,
  endDate,
  description,
  imgUrl,
}) => {
  const getRealDate = (date: string) => {
    return new Date(parseInt(date)).toLocaleString();
  }
  return (
    <Card className="p-4 max-w-sm bg-secondary rounded-2xl">
      <div className="flex flex-col h-full">
        {imgUrl && (
          <div className="">
            <Image
              src={imgUrl}
              alt="Project Image"
              width={500}
              height={1}
              className="rounded-2xl"
            />
          </div>
        )}
        <div className="flex-grow">
          <CardHeader>
            <CardTitle className="truncate text-lg  font-semibold">
              Created by @{creator}
            </CardTitle>
            <CardTitle className="text-xl">Name: {name}</CardTitle>
          </CardHeader>
          <CardContent className="mt-2">
            <div className="mb-2">
              <p className="font-semibold">Progress:</p>
              <Progress value={progress} className="w-full" />
            </div>
            <div className="text-sm text-cyan-400">
              <p>start: {getRealDate(startDate)}</p>
              <p>end: {getRealDate(endDate)}</p>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Description:</p>
              <p className="text-cyan-400">{description}</p>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
export type { Project };
