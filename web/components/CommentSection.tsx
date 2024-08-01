import React, { useCallback } from "react";
import Comment from "@/components/comment";
import NewComment from "@/components/new_comment";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";
import useSubmitCommentLike from "@/hooks/useSubmitCommentLike";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  projectId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const { comments, fetchComments } = useComments(projectId);
  const { submitComment } = useSubmitComment();
  const { submitCommentLike } = useSubmitCommentLike(projectId);

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
        projectId,
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
    [connectionStatus, projectId, submitComment, fetchComments, toast]
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
        projectId,
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
    [connectionStatus, projectId, submitComment, fetchComments, toast]
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

  return (
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
  );
};

export default CommentSection;
