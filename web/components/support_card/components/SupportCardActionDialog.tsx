import React, { useCallback, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonAction } from "../SupportCard";
import { ProjectReward } from "@/type";

interface SupportCardActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ConfirmationData) => void;
  data: SupportCardActionDialogData | undefined;
}

export interface SupportCardActionDialogData {
  ticket: ProjectReward;
  action: ButtonAction;
}

export interface ConfirmationData {
  id: string;
  action: ButtonAction;
  address?: string;
  amount?: number;
}

export function SupportCardActionDialog({
  isOpen,
  onClose,
  onConfirm,
  data,
}: SupportCardActionDialogProps) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = useCallback(() => {
    if (
      data?.action === "split" &&
      (!amount ||
        Number(amount) > (data.ticket.amount || 0) ||
        Number(amount) < 1)
    ) {
      setError("Invalid amount for split operation");
      return;
    }

    const confirmationData: ConfirmationData = {
      id: data?.ticket.id!,
      action: data?.action!,
      ...(data?.action === "transfer" && { address }),
      ...(data?.action === "split" && { amount: Number(amount) }),
    };

    onConfirm(confirmationData);
    setAddress("");
    setAmount("");
    setError("");
    onClose();
  }, [data, address, amount, onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
    setAddress("");
    setAmount("");
    setError("");
  }, [onClose]);

  const dialogContent = useMemo(() => {
    const getDialogTitle = () => {
      switch (data?.action) {
        case "transfer":
          return "Transfer Confirmation";
        case "split":
          return "Split Confirmation";
        case "merge":
          return "Merge Confirmation";
        case "burn":
          return "Burn Confirmation";
        case "stake":
          return "Stake Confirmation";
        default:
          return "Action Confirmation";
      }
    };

    const getDialogDescription = () => {
      switch (data?.action) {
        case "transfer":
          return "You are about to transfer the support card: ";
        case "split":
          return "You are about to split the support card: ";
        case "merge":
          return "You are about to merge the support card: ";
        case "burn":
          return "You are about to burn the support card. This action is irreversible: ";
        case "stake":
          return "You are about to stake the support card: ";
        default:
          return "You are about to perform an action on the support card: ";
      }
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()} {data?.ticket.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {data?.action === "transfer" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="address"
                placeholder="Enter recipient address"
                className="col-span-4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}
          {data?.action === "split" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="amount"
                type="number"
                placeholder={`Enter amount (max: ${
                  (data.ticket.amount || 0) - 1
                })`}
                className="col-span-4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={(data.ticket.amount || 0) - 1}
                min={1}
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </>
    );
  }, [data, address, amount, error]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {dialogContent}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
