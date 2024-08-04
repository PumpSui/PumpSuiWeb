import { useCallback, useMemo } from "react";
import { getAllComments,} from "@/api/suifund";
import { getRealDate } from "@/lib/utils";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { CommentProps, CommentType, ObjectsResponseType } from "@/type";
import useSWRInfinite from "swr/infinite";



const useComments = (threadId: string | undefined) => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const getKey = (
    pageIndex: number,
    previousPageData: ObjectsResponseType<CommentType> | null
  ) => {
    if (previousPageData && !previousPageData.hasNextPage) return null;
    if (pageIndex === 0) return [threadId, undefined];
    return [threadId, previousPageData!.nextCursor];
  };

  const fetcher = async ([threadId, cursor]: [
    string | undefined,
    string | undefined
  ]) => {
    if (!threadId) throw new Error("Thread ID is undefined");
    return getAllComments(client, threadId, cursor);
  };

  const { data, size, setSize, mutate, isValidating } = useSWRInfinite<
    ObjectsResponseType<CommentType>
  >(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateAll: false,
  });

  const comments = useMemo(() => {
    if (!data) return [];

    const allComments = data.flatMap((page) => page.data);
    const commentsMap: { [key: string]: CommentProps } = {};

    // First, create CommentProps for all comments
    allComments.forEach((comment) => {
      commentsMap[comment.id] = {
        id: comment.id,
        content: comment.content,
        date: getRealDate(comment.timestamp),
        isReply: !!comment.reply,
        author: comment.creator,
        reply: comment.reply || "",
        replies: [],
        likeCount: comment.likes.length,
        islike: comment.likes.includes(currentAccount?.address!),
        index: comment.index,
      };
    });

    // Then, structure the comments hierarchy
     const rootComments: CommentProps[] = [];
     Object.values(commentsMap).forEach((comment) => {
       if (comment.reply && commentsMap[comment.reply]) {
         // If this is a reply and its parent exists, add it to the parent's replies
         commentsMap[comment.reply].replies!.push(comment);
       } else {
         // If it's not a reply, or if the parent doesn't exist, add it to root comments
         rootComments.push(comment);
       }
     });

    // Sort root comments and their replies by timestamp (assuming newer comments should appear first)
    const sortByDate = (a: CommentProps, b: CommentProps) => a.index-b.index;

    rootComments.sort(sortByDate);
    rootComments.forEach((comment) => comment.replies!.sort(sortByDate));
    
    return rootComments;
  }, [data, currentAccount?.address]);

  const refreshComments = useCallback(() => {
    mutate();
  }, [mutate]);

  const loadMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const isLoadingMore =
    isValidating || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data.length === 0;
  const isReachingEnd =
    isEmpty || (data && !data[data.length - 1]?.hasNextPage);

  return {
    comments,
    refreshComments,
    loadMore,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
  };
};

export default useComments;
