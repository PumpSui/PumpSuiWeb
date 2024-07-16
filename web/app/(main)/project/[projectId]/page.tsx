// pages/index.tsx
"use client";
import ProjectCard from "@/components/project_card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { CommentProps } from "@/type";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import { add_comment, getAllComments, getAllCommentsGraphQl } from "@/api/suifund";
import { getRealDate } from "@/lib/utils";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import NewComment from "@/components/new_comment";
import { useCurrentAccount, useCurrentWallet, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const router = useRouter();
  const { selectedProject } = useProject();
  const [comments, setComments] = useState<CommentProps[]>([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const client = useSuiClient();

   const getAllComments_inner = useCallback(async () => {
     if (selectedProject && selectedProject?.thread) {
       const result = await getAllComments(client, selectedProject.thread);
       console.log(result);
       const comments: CommentProps[] = result.map((comment) => ({
         id: comment.id,
         content: comment.content,
         date: getRealDate(comment.timestamp),
         isReply: comment.reply ? true : false,
         author: comment.creator,
         replies: [], // Assumed the data structure
       }));
       setComments(comments);
     }
   }, [client, selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      router.push("/");
    } else {
      getAllComments_inner();
    }
  }, [selectedProject, router, getAllComments_inner]);

  const handleNewCommentSubmit = async (content: string) => {
    if (connectionStatus !== "connected") {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
      return;
    }
    const newCommentParams = {
      project_record: selectedProject?.id,
      reply: "",
      media_link: "",
      content,
    };
    const txb = add_comment(
      newCommentParams.project_record!,
      newCommentParams.reply,
      newCommentParams.media_link,
      newCommentParams.content
    );
    await signAndExecuteTransaction(
      {
        transaction: txb,
        chain: "sui::testnet",
      },
      {
        onSuccess: async () => {
          console.log("Comment added");
          await getAllComments_inner();
        },
        onError: (error) => {
          toast({
            variant:"destructive",
            title: "Error",
            content: error.message.toString(),
          });
        },
      }
    );
    console.log(newCommentParams);
  };

  const handleReplySubmit = (comment: string, id: string) => {
    // 这里应该根据你的具体需求来处理回复逻辑
    console.log("Reply submitted:", comment, id);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="relative w-full rounded-lg overflow-hidden max-h-64 h-64">
        <ProjectImage imageUrl={selectedProject?.image_url!} height={320} />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between gap-x-10">
          <Card className="p-4 min-w-96 w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Description</CardTitle>
            </CardHeader>
            <CardContent>{selectedProject?.description}</CardContent>
          </Card>
          <div className="min-w-96">
            <ProjectCard isDetail {...selectedProject!}></ProjectCard>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <Comment key={index} {...comment} onReplySubmit={handleReplySubmit} />
        ))}
        <NewComment onSubmit={handleNewCommentSubmit} />
      </div>
    </div>
  );
};

export default Page;
function signAndExecuteTransaction(
  arg0: {
    transaction: import("@mysten/sui/transactions").Transaction;
    chain: string;
  },
  arg1: { onSuccess: () => void; onError: (error: any) => void }
) {
  throw new Error("Function not implemented.");
}
