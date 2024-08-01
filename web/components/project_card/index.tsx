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
          src="/images/card.svg"
          alt="Background"
          fill
          className="object-fill"
          quality={75}
        />
      </div>

      <div className={styles.projectImage}>
        <Image
          src={project.image_url || "/images/DemoProject.png"}
          alt="Project"
          fill
          className="object-fill"
          quality={75}
        />
      </div>

      <div className={styles.rocket}>
        <Image
          src="/images/rocket.svg"
          alt="Rocket"
          fill
          className={`object-fill ${
            project.start_time_ms < currentTime ? styles.activeRocket : ""
          }`}
          quality={75}
        />
      </div>

      <div className="absolute inset-0 flex flex-col">
        <div className={styles.createdBy}>
          <p className="truncate text-yellow-400 text-sm font-bold">
            Created by @{project.creator}
          </p>
        </div>

        <div className={styles.name}>
          <p className="text-gray-800 text-2xl font-bold truncate">
            {project.name}
          </p>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <p className="mb-1">Progress:</p>
            <Progress
              value={(1 - project.remain / project.total_supply) * 100}
              className="w-full self-center min-h-4 bg-primary-foreground rounded-lg"
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
