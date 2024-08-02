import React, { useCallback, useEffect, useState } from "react";
import Comment from "@/components/comment";
import NewComment from "@/components/new_comment";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";
import useSubmitCommentLike from "@/hooks/useSubmitCommentLike";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  threadID: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ threadID }) => {
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const { comments, fetchComments } = useComments(threadID);
  const { submitComment } = useSubmitComment();
  const { submitCommentLike } = useSubmitCommentLike(threadID);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 使用 useEffect 来监听 refreshTrigger 的变化，并在变化时刷新评论
  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  const refreshComments = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

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
        threadID,
        content,
        "",
        async () => {
          refreshComments();
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
    [connectionStatus, threadID, submitComment, refreshComments, toast]
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
        threadID,
        comment,
        id,
        async () => {
          refreshComments();
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
    [connectionStatus, threadID, submitComment, refreshComments, toast]
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
          refreshComments();
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
    [connectionStatus, submitCommentLike, refreshComments, toast]
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
