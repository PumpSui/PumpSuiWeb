import { do_burn } from "@/api/suifund";
import { useToast } from "@/components/ui/use-toast";
import { ProjectReward } from "@/type";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";

const useTicketActions = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const transferTicket = async (ticket: ProjectReward, address: string) => {
    if (!isValidSuiAddress(address)) {
      throw new Error("Invalid address");
    }
    if (!isValidSuiAddress(ticket.id)) {
      throw new Error("Invalid address");
    }
    const txb = new Transaction();
    txb.transferObjects([ticket.id], address);
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

  const burnTicket = async (ticket: ProjectReward, address: string) => {
    if (!isValidSuiAddress(address)) {
      throw new Error("Invalid address");
    }
    const txb = do_burn(ticket.project_id, ticket.id, address);
    await signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: () => {
          onSuccess();
          toast({
            title: "Success",
            description: `Ticket burned successfully`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to burn ticket",
          });
        },
      }
    );
  };

  return {
    transferTicket,
    burnTicket,
  };
};

export default useTicketActions;
