// pages/index.tsx
"use client";
import ProjectCard from "@/components/project_card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import NewComment from "@/components/new_comment";
import { useCurrentAccount, useCurrentWallet, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";
import useSubmitCommentLike from "@/hooks/useSubmitCommentLike";
import MintCard from "@/components/mint_card";
import { do_mint } from "@/api/suifund";
import { MIST_PER_SUI } from "@mysten/sui/utils";

const Page = () => {
  const router = useRouter();
  const { selectedProject } = useProject();
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const { comments, fetchComments } = useComments(selectedProject?.thread);
  const { submitComment } = useSubmitComment();
  const { submitCommentLike } = useSubmitCommentLike(selectedProject?.id);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  if (!selectedProject) {
    router.push("/");
    return null;
  }
  const handleNewCommentSubmit = async (content: string) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    await submitComment(
      selectedProject.id,
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
  };

  const handleReplySubmit = async (comment: string, id: string) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }

    await submitComment(
      selectedProject.id,
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
  };

  const handleLikeClick = async (islike: boolean, index: number) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
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
  };

  const handleMintSubmit = async (value: number) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }
    console.log(selectedProject.id);
    const txb = await do_mint(
      selectedProject.id,
      BigInt(value) * MIST_PER_SUI,
      currentAccount?.address!,
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
    )
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
        <ProjectImage imageUrl={selectedProject.image_url} height={320} />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between gap-x-10">
          <Card className="p-4 min-w-96 w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent>{selectedProject.description}</CardContent>
          </Card>
          <div className="min-w-96">
            <MintCard
              {...selectedProject}
              onSubmitMint={handleMintSubmit}
              isStartMint={selectedProject.start_time_ms > Date.now() || selectedProject.end_time_ms < Date.now()}
            />
          </div>
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
  );
};

export default Page;
