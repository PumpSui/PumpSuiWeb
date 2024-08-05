'use client';
import { useEffect, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import { useToast } from "@/components/ui/use-toast";
import { ProjectSkeleton } from "../Skeleton";
import { EditProjectModal } from "@/components/EditProjectModal";

import useProjectActions from "@/hooks/useProjectActions";
import useMintActions from "@/hooks/useMintActions";
import ProjectHeader from "@/components/ProjectHeader";
import ProjectDescription from "@/components/ProjectDescription";
import ProjectSocial from "@/components/ProjectSocial";
import CommentSection from "@/components/CommentSection";
import MintCard from "@/components/mint_card";
import useProjectData from "@/hooks/useProjectData";


const Page: NextPage<{ params: { projectId: string } }> = ({ params }) => {
  const { selectedProject, setSelectedProject } = useProject();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, error, isLoading } = useProjectData(params.projectId);
  const { handleEditSubmit, handleBurnProject } =
    useProjectActions(selectedProject);
  const { handleMintSubmit, isStartMint, isCreator } = useMintActions(
    selectedProject,
    refId
  );

  useEffect(() => {
    if (data) {
      setSelectedProject(data);
    } else if (error) {
      toast({ title: "Error", description: error.toString() });
    }
  }, [data, error, setSelectedProject, toast]);

  if (isLoading) return <ProjectSkeleton />;
  if (!selectedProject) return <div>No project found</div>;

  return (
    <>
      <Head>
        <title>{selectedProject.name} | Project Details</title>
        <meta name="description" content={selectedProject.description} />
      </Head>
      <div className="container mx-auto p-4 space-y-6">
        <ProjectHeader project={selectedProject} />
        <div className="flex flex-col md:flex-row gap-6">
          <ProjectDescription project={selectedProject} />
          <div>
            <ProjectSocial
              project={selectedProject}
              projectId={params.projectId}
            />
            <MintCard
              project={selectedProject}
              isCreator={isCreator}
              onSubmitMint={handleMintSubmit}
              isStartMint={isStartMint}
              onSubmitEdit={() => setIsEditModalOpen(true)}
            />
          </div>
        </div>

        <CommentSection
          threadID={selectedProject.thread}
          selectedProjectId={selectedProject.id}
        />
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          onBurn={handleBurnProject}
          project={selectedProject}
        />
      </div>
    </>
  );
};

export default Page;
