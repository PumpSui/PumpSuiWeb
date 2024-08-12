import { Progress } from "../ui/progress";
import Image from "next/image";
import { ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import { getRealDate } from "@/lib/utils";
import { useProject } from "../providers/ProjectContext";
import styles from "./ProjectCard.module.css";


interface ProjectCardProps extends ProjectRecord {
  isDetail?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = (project) => {
  const router = useRouter();
  const { setSelectedProject } = useProject();
  const currentTime = Date.now();

  const handleCardOnClick = () => {
    setSelectedProject(project);
    !project.isDetail && router.push(`/project/${project.id}`);
  };

  return (
    <div onClick={handleCardOnClick} className={`group ${styles.card}`}>
      <div
        className={`${styles.background} group-hover:brightness-200 group-hover:contrast-125 group-hover:saturate-200`}
      >
        <Image
          src="/images/card.png"
          alt="Background"
          fill
          sizes="100%"
          priority
          quality={75}
        />
      </div>

      <div className={styles.projectImage}>
        <Image
          src={project.image_url || "/images/DemoProject.png"}
          alt="Project"
          fill
          style={{ objectFit: "contain" }}
          sizes="100%"
          quality={75}
        />
      </div>

      <div className={styles.rocket}>
        <Image
          src="/images/rocket.svg"
          alt="Rocket"
          fill
          priority
          className={`${
            project.start_time_ms < currentTime
              ? styles.activeRocket
              : " brightness-50 saturate-50"
          }`}
          sizes="100%"
          quality={75}
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="absolute mt-[20%] max-w-48 lg:scale-50 mac:scale-75">
          <p className="truncate text-yellow-400 text-sm font-bold">
            Created by @{project.creator}
          </p>
        </div>

        <div className="absolute mt-[66%] max-w-48 lg:scale-50 lg:mt-[63%] mac:scale-100 mac:mt-[65%]">
          <p className="text-gray-800 text-2xl font-bold truncate mac:text-xl 2xl:text-2xl">
            {project.name}
          </p>
        </div>

        <div className="absolute mt-[80%] 2xl:scale-100 mac:scale-75 lg:scale-50 lg:mt-[70%] mac:mt-[78%]">
          <div className={styles.progressBar}>
            <p className="mb-1">PROGRESS:</p>
            <Progress
              value={(1 - project.remain / project.total_supply) * 100}
              className="w-full self-center min-h-4 mb-1"
              indicatorColor="bg-gradient-to-b from-yellow-300 to-orange-500 rounded-lg shadow-2xl transform"
              threshhold={project.threshold_ratio}
            />
          </div>
          <p>START: {getRealDate(project.start_time_ms)}</p>
          <p>END: {getRealDate(project.end_time_ms)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
