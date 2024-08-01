import { useCallback, useMemo } from "react";
import {
  useCurrentAccount,
  useCurrentWallet,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";
import { do_mint } from "@/api/suifund";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { ProjectRecord } from "@/type";

const useMintActions = (
  selectedProject: ProjectRecord | null,
  refId: string | null
) => {
  const { connectionStatus } = useCurrentWallet();
  const { toast } = useToast();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleMintSubmit = useCallback(
    async (value: number) => {
      if (connectionStatus !== "connected") {
        toast({
          title: "Error",
          description: "Please connect your wallet",
        });
        return;
      }
      if (!selectedProject || !currentAccount) return;

      const txb = do_mint(
        selectedProject.id,
        BigInt(value) * MIST_PER_SUI,
        currentAccount.address,
        refId ?? ""
      );
      await signAndExecuteTransaction(
        {
          transaction: txb,
          chain: "sui::testnet",
        },
        {
          onSuccess: async () => {
            toast({
              title: "Success",
              description: "Minted successfully",
            });
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message.toString(),
            });
          },
        }
      );
    },
    [
      connectionStatus,
      selectedProject,
      currentAccount,
      signAndExecuteTransaction,
      toast,
      refId,
    ]
  );

  const isStartMint = useMemo(() => {
    if (!selectedProject) return false;
    return (
      selectedProject.start_time_ms > Date.now() ||
      selectedProject.end_time_ms < Date.now()
    );
  }, [selectedProject]);

  const isCreator = useMemo(() => {
    return selectedProject?.creator === currentAccount?.address;
  }, [selectedProject, currentAccount]);

  return { handleMintSubmit, isStartMint, isCreator };
};

export default useMintActions;
