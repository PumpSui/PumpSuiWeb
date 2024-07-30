// pages/index.tsx
"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Comment from "@/components/comment";
import { useProject } from "@/components/providers/ProjectContext";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import NewComment from "@/components/new_comment";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";
import useSubmitCommentLike from "@/hooks/useSubmitCommentLike";
import MintCard from "@/components/mint_card";
import {
  do_mint,
  edit_project,
  getAllProjectAdminCapGraphql,
  getProjectRecord,
} from "@/api/suifund";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import { ProjectSkeleton } from "../Skeleton";
import useSWR, { useSWRConfig } from "swr";
import SocialIcons from "@/components/SocialIcons";
import { EditEnum, editProjectParam, ProjectRecord } from "@/type";
import { EditProjectModal } from "@/components/EditProjectModal";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

interface ProjectPageParams extends ParsedUrlQuery {
  projectId: string;
}

const Page: NextPage<{ params: ProjectPageParams }> = ({ params }) => {
  const { selectedProject, setSelectedProject } = useProject();
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const { comments, fetchComments } = useComments(selectedProject?.thread);
  const { submitComment } = useSubmitComment();
  const { submitCommentLike } = useSubmitCommentLike(selectedProject?.id);
  const currentAccount = useCurrentAccount();
  const { mutate } = useSWRConfig();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const graphqlClient = new SuiGraphQLClient({
    url: "https://sui-testnet.mystenlabs.com/graphql",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  

  const { data, error: swrError } = useSWR(
    [params.projectId, client],
    ([id, client]) => getProjectRecord(id, client)
  );

  const refreshProjectData = useCallback(async () => {
    if (params.projectId) {
      const newData = await mutate([params.projectId, client]);
      if (newData) {
        setSelectedProject(newData);
      }
    }
  }, [mutate, params.projectId, client, setSelectedProject]);

  const { data: adminCapMap } = useSWR(
    currentAccount?.address ? [currentAccount?.address] : null,
    ([address]) => getAllProjectAdminCapGraphql(graphqlClient, address)
  );

  const handleEditSubmit = useCallback(
    async (editedProject: Partial<ProjectRecord>) => {
      // Implement the logic to update the project
      // This might involve calling an API or updating the state
      const admincap = adminCapMap![editedProject.id!];
      const editFields = {
        image_url: EditEnum.edit_image_url,
        x: EditEnum.edit_x_url,
        telegram: EditEnum.edit_telegram_url,
        discord: EditEnum.edit_discord_url,
        website: EditEnum.edit_website_url,
        github: EditEnum.edit_github_url,
        description: EditEnum.edit_description,
      };
      const params: editProjectParam[] = Object.entries(editFields)
        .map(([field, editEnum]) => {
          if (
            editedProject[field as keyof Partial<ProjectRecord>] !==
            selectedProject?.[field as keyof ProjectRecord]
          ) {
            return {
              type: editEnum,
              project_record: selectedProject?.id!,
              project_admin_cap: admincap,
              content: editedProject[field as keyof ProjectRecord] as string,
            };
          }
          return null;
        })
        .filter((param): param is editProjectParam => param !== null);
      
      const txb = await edit_project(params);
      signAndExecuteTransaction(
        {
          transaction: txb,
          chain: "sui::testnet",
        },
        {
          onSuccess: async () => {
            toast({
              title: "Success",
              description: "Project updated successfully",
            });
            await refreshProjectData();
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message.toString(),
            });
          },
        }
      );
    },
    [adminCapMap, refreshProjectData, selectedProject, signAndExecuteTransaction, toast]
  );

  const handleBurnProject = useCallback(() => {
    // Implement the logic to burn the project
    // This might involve calling an API or updating the state
    console.log("Project burned");
    toast({
      title: "Success",
      description: "Project burned successfully",
    });
  }, [toast]);

  useEffect(() => {
    if (data) {
      setSelectedProject(data);
      setIsLoading(false);
    } else if (swrError) {
      toast({
        title: "Error",
        description: swrError.toString(),
      });
      setIsLoading(false);
    }
  }, [data, swrError, setSelectedProject, toast]);

  const handleNewCommentSubmit = useCallback(
    async (content: string) => {
      if (connectionStatus !== "connected") {
        toast({
          title: "Error",
          description: "Please connect your wallet",
        });
        return;
      }

      await submitComment(
        selectedProject!.id,
        content,
        "",
        async () => {
          await fetchComments();
          toast({
            title: "Success",
            description: "Comment added successfully",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        }
      );
    },
    [connectionStatus, selectedProject, submitComment, fetchComments, toast]
  );

  const handleReplySubmit = useCallback(
    async (comment: string, id: string) => {
      if (connectionStatus !== "connected") {
        toast({
          title: "Error",
          description: "Please connect your wallet",
        });
        return;
      }

      await submitComment(
        selectedProject!.id,
        comment,
        id,
        async () => {
          await fetchComments();
          toast({
            title: "Success",
            description: "Reply added successfully",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        }
      );
    },
    [connectionStatus, selectedProject, submitComment, fetchComments, toast]
  );

  const handleLikeClick = useCallback(
    async (islike: boolean, index: number) => {
      if (connectionStatus !== "connected") {
        toast({
          title: "Error",
          description: "Please connect your wallet",
        });
        return;
      }
      await submitCommentLike(
        index,
        islike,
        async () => {
          await fetchComments();
          toast({
            title: "Success",
            description: "Like added successfully",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        }
      );
    },
    [connectionStatus, submitCommentLike, fetchComments, toast]
  );

  const handleMintSubmit = useCallback(
    async (value: number) => {
      if (connectionStatus !== "connected") {
        toast({
          title: "Error",
          description: "Please connect your wallet",
        });
        return;
      }
      const txb = await do_mint(
        selectedProject!.id,
        BigInt(value) * MIST_PER_SUI,
        currentAccount?.address!
      );
      await signAndExecuteTransaction(
        {
          transaction: txb,
          chain: "sui::testnet",
        },
        {
          onSuccess: async () => {
            toast({
              title: "Success",
              description: "Minted successfully",
            });
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message.toString(),
            });
          },
        }
      );
    },
    [
      connectionStatus,
      selectedProject,
      currentAccount,
      signAndExecuteTransaction,
      toast,
    ]
  );
  const isStartMint = useMemo(() => {
    if (!selectedProject) return false;
    return (
      selectedProject.start_time_ms > Date.now() ||
      selectedProject.end_time_ms < Date.now()
    );
  }, [selectedProject]);

  const socialLinks = useMemo(() => {
    if (!selectedProject) return {};
    return {
      twitter: selectedProject.x,
      telegram: selectedProject.telegram,
      discord: selectedProject.discord,
      website: selectedProject.website,
      github: selectedProject.github,
    };
  }, [selectedProject]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!selectedProject) {
    return <div>No project found</div>;
  }

  return (
    <>
      <Head>
        <title>{selectedProject.name} | Project Details</title>
        <meta name="description" content={selectedProject.description} />
      </Head>
      <div className="container mx-auto p-4 space-y-6">
        <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
          <ProjectImage imageUrl={selectedProject.image_url} height={320} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="p-4 flex-grow shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent>{selectedProject.description}</CardContent>
          </Card>

          <div className="md:w-96">
            <MintCard
              onSubmitEdit={() => setIsEditModalOpen(true)}
              isCreator={selectedProject.creator == currentAccount?.address}
              {...selectedProject}
              onSubmitMint={handleMintSubmit}
              isStartMint={isStartMint}
            />
            <SocialIcons socialLinks={socialLinks} />
          </div>
        </div>

        <div className="space-y-4">
          {comments.map((comment, index) => (
            <Comment
              key={index}
              {...comment}
              onReplySubmit={handleReplySubmit}
              onLikeSubmit={handleLikeClick}
            />
          ))}
          <NewComment onSubmit={handleNewCommentSubmit} />
        </div>
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
