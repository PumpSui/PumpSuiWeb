import { useToast } from "@/components/ui/use-toast";
import { ProjectReward } from "@/type";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";

const useTicketActions = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const transferTicket = async (ticketId: string, address: string) => {
    if (!isValidSuiAddress(address)) {
      throw new Error("Invalid address");
    }
    if (!isValidSuiAddress(ticketId)) {
      throw new Error("Invalid address");
    }
    const txb = new Transaction();
    txb.transferObjects([ticketId], address);
    signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: (res) => {
          onSuccess();
          toast({
            title: "Success",
            description: `Ticket transferred successfully \n 
                        https://suivision.xyz/txblock/${res.digest}`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to transfer ticket",
          });
        },
      }
    );
  };

  return {
    transferTicket,
  };
};

export default useTicketActions;
