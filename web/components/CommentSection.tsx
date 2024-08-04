import React, { useCallback, useEffect, useRef } from "react";
import Comment from "@/components/comment";
import NewComment from "@/components/new_comment";
import useComments from "@/hooks/useComments";
import useSubmitComment from "@/hooks/useSubmitComment";
import useSubmitCommentLike from "@/hooks/useSubmitCommentLike";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  threadID: string;
  selectedProjectId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  threadID,
  selectedProjectId,
}) => {
   const { connectionStatus } = useCurrentWallet();
   const intervalRef = useRef<number | null>(null);
   const { toast } = useToast();
   const {
     comments,
     refreshComments,
     loadMore,
     isLoadingMore,
     isEmpty,
     isReachingEnd,
   } = useComments(threadID);
   const { submitComment } = useSubmitComment();
   const { submitCommentLike } = useSubmitCommentLike(selectedProjectId);

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
        selectedProjectId,
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
    [connectionStatus, submitComment, selectedProjectId, toast, refreshComments]
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
        selectedProjectId,
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
    [connectionStatus, submitComment, selectedProjectId, refreshComments, toast]
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

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      if (!isReachingEnd && !isEmpty) {
        loadMore();
      }
    }, 2000); // 2000 毫秒的间隔

    // 清理函数，组件卸载时清除定时器
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isReachingEnd, isEmpty, loadMore]);


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
      {!isEmpty && !isReachingEnd && (
        <button onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
      <NewComment onSubmit={handleNewCommentSubmit} />
    </div>
  );
};

export default CommentSection;
