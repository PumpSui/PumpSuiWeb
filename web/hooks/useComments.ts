// hooks/useComments.ts
import { useCallback, useEffect, useState } from "react";
import { getAllComments } from "@/api/suifund";
import { getRealDate } from "@/lib/utils";
import { useSuiClient } from "@mysten/dapp-kit";
import { CommentProps } from "@/type";

const useComments = (threadId: string | undefined) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const client = useSuiClient();

  const fetchComments = useCallback(async () => {
    if (threadId) {
      const result = await getAllComments(client, threadId);
      const commentsMap: { [key: string]: CommentProps } = {};

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
  }, [client, threadId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, fetchComments };
};

export default useComments;
