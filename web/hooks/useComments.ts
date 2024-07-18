// hooks/useComments.ts
import { useCallback, useEffect, useState } from "react";
import { getAllComments } from "@/api/suifund";
import { getRealDate } from "@/lib/utils";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { CommentProps } from "@/type";

const useComments = (threadId: string | undefined) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

  const fetchComments = useCallback(async () => {
    if (threadId) {
      const result = await getAllComments(client, threadId);
      const commentsMap: { [key: string]: CommentProps } = {};
      console.log("raw data",result);
      result.forEach((comment) => {
        commentsMap[comment.id] = {
          id: comment.id,
          content: comment.content,
          date: getRealDate(comment.timestamp),
          isReply: comment.reply ? true : false,
          author: comment.creator,
          reply: comment.reply ? comment.reply : "",
          replies: [],
          likeCount: comment.likes.length,
          islike: comment.likes.includes(currentAccount?.address!),
          index: comment.index,
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
      console.log("rootComments",rootComments);
      setComments(rootComments);
    }
  }, [client, currentAccount?.address, threadId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, fetchComments };
};

export default useComments;
