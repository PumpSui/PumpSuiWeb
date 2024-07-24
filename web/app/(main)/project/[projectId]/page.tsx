// pages/index.tsx
"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import ProjectCard from "@/components/project_card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { useRouter } from "next/navigation";
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
import { do_mint, getProjectRecord } from "@/api/suifund";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import { ProjectSkeleton } from "../Skeleton";
import useSWR from "swr";

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
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const shouldFetch = !selectedProject;
   const { data, error: swrError } = useSWR(
     shouldFetch ? [params.projectId, client] : null,
     ([id, client]) => getProjectRecord(id, client)
   );


  useEffect(() => {
    if (selectedProject) {
      // 如果已经有 selectedProject，直接设置加载完成
      setIsLoading(false);
    } else if (data) {
      // 如果 SWR 获取到了数据，更新 selectedProject
      setSelectedProject(data);
      setIsLoading(false);
    } else if (swrError) {
      // 处理 SWR 错误
      setIsLoading(false);
    }
  }, [selectedProject, data, swrError, setSelectedProject]);


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

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
              {...selectedProject}
              onSubmitMint={handleMintSubmit}
              isStartMint={isStartMint}
            />
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
      </div>
    </>
  );
};

export default Page;
