import { do_burn, do_split } from "@/api/suifund";
import { useToast } from "@/components/ui/use-toast";
import { ProjectReward } from "@/type";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";

const useTicketActions = (onSuccess?: () => void) => {
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
          onSuccess && onSuccess();
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
         onSuccess && onSuccess();
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

  const mergeTickets = async (tickets: string[]) => {
    if (tickets.length < 2) {
      throw new Error("Invalid number of tickets to merge");
    }
    const txb = new Transaction();
    for (let i = 1; i < tickets.length; i++) {
      if (!isValidSuiAddress(tickets[i])) {
        throw new Error("Invalid address");
      }
      txb.moveCall({
        package: process.env.NEXT_PUBLIC_PACKAGE!,
        module: "suifund",
        function: "do_merge",
        arguments: [txb.object(tickets[0]), txb.object(tickets[i])],
      });
    }
    await signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: () => {
          onSuccess && onSuccess();
          toast({
            title: "Success",
            description: `Tickets merged successfully`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to merge tickets",
          });
        },
      }
    );
  };

  const splitTicket = async (ticket: ProjectReward, amount: number,address:string) => {
    if (!isValidSuiAddress(ticket.id)) {
      throw new Error("Invalid address");
    }
    if(!isValidSuiAddress(address)){
        throw new Error("Invalid address");
    }
    const txb = do_split(ticket.id, amount, address);
    await signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: () => {
          onSuccess && onSuccess();
          toast({
            title: "Success",
            description: `Ticket split successfully`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to split ticket",
          });
        },
      }
    );
  }

  return {
    transferTicket,
    burnTicket,
    mergeTickets,
    splitTicket,
  };
};

export default useTicketActions;
