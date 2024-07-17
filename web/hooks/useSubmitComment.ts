// hooks/useSubmitComment.ts
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { add_comment } from "@/api/suifund";

const useSubmitComment = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const submitComment = async (
    selectedProjectId: string,
    content: string,
    reply: string = "",
    onSuccess: () => void,
    onError: (error: any) => void
  ) => {
    const newCommentParams = {
      project_record: selectedProjectId,
      reply,
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
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  };

  return { submitComment };
};

export default useSubmitComment;
