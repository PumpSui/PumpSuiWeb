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
      linktree: project.linktree,
    };
  }, [project]);

  return (
    <div className="flex justify-between border border-gray-500 rounded-2xl px-4 py-2">
      <SocialIcons socialLinks={socialLinks} />
      <ReferralLink projectId={projectId} />
    </div>
  );
};

export default ProjectSocial;
