"use client";
import ProjectCard from "@/components/project_card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Comment from "@/components/comment";
import { CommentProps } from "@/type";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/components/providers/ProjectContext";
import {
  add_comment,
  getAllComments,
  getAllCommentsGraphQl,
} from "@/api/suifund";
import { getRealDate } from "@/lib/utils";
import ProjectImage from "@/components/project_card/components/ProjectImage";
import NewComment from "@/components/new_comment";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
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
    if (selectedProject?.thread) {
      const result = await getAllComments(client, selectedProject.thread);
      
      const commentsMap: { [key: string]: CommentProps } = {};

      // 索引所有评论
      result.forEach((comment) => {
        commentsMap[comment.id] = {
          id: comment.id,
          content: comment.content,
          date: getRealDate(comment.timestamp),
          isReply: comment.reply ? true : false,
          author: comment.creator,
          reply: comment.reply ? comment.reply : "",
          replies: [],
        };
      });

      // 构建评论树
      const rootComments: CommentProps[] = [];
      result.forEach((comment) => {
        if (comment.reply) {
          if (commentsMap[comment.reply]) {
            commentsMap[comment.reply].replies!.push(commentsMap[comment.id]);
          }
        } else {
          rootComments.push(commentsMap[comment.id]);
        }
      });
      setComments(rootComments);
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
          toast({
            title: "Success",
            description: "Comment added successfully",
          });
        },
        onError: (error) => {
          console.log("Error adding comment:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        },
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
    const newCommentParams = {
      project_record: selectedProject?.id,
      reply: id,
      media_link: "",
      content: comment,
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
          console.log("Reply added");
          await getAllComments_inner();
          toast({
            title: "Success",
            description: "Reply added successfully",
          });
        },
        onError: (error) => {
          console.log("Error adding reply:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        },
      }
    );
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
