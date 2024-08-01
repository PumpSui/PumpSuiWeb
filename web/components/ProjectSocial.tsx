import React, { useMemo } from "react";
import SocialIcons from "@/components/SocialIcons";
import ReferralLink from "@/components/ReferralLink";
import { ProjectRecord } from "@/type";

interface ProjectSocialProps {
  project: ProjectRecord;
  projectId: string;
}

const ProjectSocial: React.FC<ProjectSocialProps> = ({
  project,
  projectId,
}) => {
  const socialLinks = useMemo(() => {
    return {
      twitter: project.x,
      telegram: project.telegram,
      discord: project.discord,
      website: project.website,
      github: project.github,
    };
  }, [project]);

  return (
    <div className="flex justify-around items-center">
      <ReferralLink projectId={projectId} />
      <SocialIcons socialLinks={socialLinks} />
    </div>
  );
};

export default ProjectSocial;
