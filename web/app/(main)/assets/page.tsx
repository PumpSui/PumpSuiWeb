"use client";
import { getAllSupportTicket } from "@/api/suifund";
import MarketNav from "@/components/market_nav/MarketNav";
import SupportCard, {
  ButtonAction,
} from "@/components/support_card/SupportCard";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import {
  ConfirmationData,
  SupportCardActionDialog,
  SupportCardActionDialogData,
} from "@/components/support_card/components/SupportCardActionDialog";
import React from "react";
import useTicketActions from "@/hooks/useTicketActions";
import { SuiClient } from "@mysten/sui/client";

const getSwrKey = (client: SuiClient | null, address: string | undefined) =>
  ["supportTickets", client, address] as const;

const Page = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const client = useSuiClient();
  const swrkey = getSwrKey(client, address!);
  const { data, mutate } = useSWR(swrkey, ([_, client, address]) =>
    address && isValidSuiAddress(address)
      ? getAllSupportTicket(client!, address)
      : null
  );

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<
    SupportCardActionDialogData | undefined
  >(undefined);
  const { transferTicket } = useTicketActions(async () => {
    await mutate(undefined,{revalidate:true});
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    return selectedProject
      ? data.filter((item) => item.name === selectedProject)
      : data;
  }, [data, selectedProject]);

  const handleCategorySelect = (project: string) => {
    setSelectedCards([]);
    setIsMultiSelectMode(false);
    setSelectedProject(project === selectedProject ? null : project);
  };

  const handleSupportButtonClick = useCallback(
    (action: ButtonAction, name: string, id: string) => {
      if (action === "merge") {
        setIsMultiSelectMode(true);
        setSelectedProject(name);
        setSelectedCards([id]);
      } else {
        // Handle other actions
        const ticket = data?.find((item) => item.id === id);
        if (ticket) {
          setDialogData({ ticket, action });
          setIsDialogOpen(true);
        }
      }
    },
    [data]
  );

  const handleCardClick = useCallback(
    (id: string) => {
      if (isMultiSelectMode) {
        setSelectedCards((prev) =>
          prev.includes(id)
            ? prev.filter((cardId) => cardId !== id)
            : [...prev, id]
        );
      }
    },
    [isMultiSelectMode]
  );

  const handleMergeConfirm = () => {
    // Implement merge logic here
    console.log("Merging cards:", selectedCards);
    // Reset multi-select mode and selected cards
    setIsMultiSelectMode(false);
    setSelectedCards([]);
  };

  const handleActionDialogConfirm = async (data: ConfirmationData) => {
    switch (data.action) {
      case "transfer":
        console.log("Transfering ticket:", data);
        await transferTicket(data.id, data.address!)        
        break;
      case "split":
        console.log("Spliting ticket:", data);
        break;
      case "burn":
        console.log("Burning ticket:", data);
        break;
      case "stake":
        console.log("Staking ticket:", data);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="max-w-lg">
          <MarketNav
            tickets={data && data.length > 0 ? data : []}
            onProjectSelect={handleCategorySelect}
            selectedProject={selectedProject}
          />
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {filteredData.map((item) => (
              <SupportCard
                key={item.id}
                id={item.id}
                base64Image={item.image}
                name={item.name}
                amount={item.amount.toString()}
                onButtonClick={handleSupportButtonClick}
                isSelected={selectedCards.includes(item.id)}
                isMultiSelectMode={isMultiSelectMode}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
      {isMultiSelectMode && (
        <div className="fixed top-24 left-0 right-0 bg-gray-800 p-4 flex justify-between items-center">
          <span className="text-white">
            Selected: {selectedCards.length} cards
          </span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleMergeConfirm}
          >
            Merge Selected
          </button>
        </div>
      )}
      <SupportCardActionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleActionDialogConfirm}
        data={dialogData}
      />
    </div>
  );
};

export default Page;
