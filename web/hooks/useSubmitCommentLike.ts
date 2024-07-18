// hooks/useSubmitComment.ts
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { unlike_comment, like_comment } from "@/api/suifund";

const useSubmitCommentLike = (threadId:string | undefined
) => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const submitCommentLike = async (
    index: number,
    isAlreadylike: boolean,
    onSuccess: () => void,
    onError: (error: any) => void
  ) => {
    if (!threadId) {
      onError("Thread id is required");
      return;
    }
    console.log(threadId);
    const txb = isAlreadylike
      ? await unlike_comment(threadId, index)
      : await like_comment(threadId, index);

    await signAndExecuteTransaction(
      {
        transaction: txb,
        chain: "sui::testnet",
      },
      {
        onSuccess: async () => {
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  };

  return { submitCommentLike };
};

export default useSubmitCommentLike;
