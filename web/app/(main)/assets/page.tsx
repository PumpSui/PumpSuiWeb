// pages/Page.tsx
"use client";
import React, { useState, useCallback } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import MarketNav from "@/components/market_nav/MarketNav";
import {
  ConfirmationData,
  SupportCardActionDialog,
  SupportCardActionDialogData,
} from "@/components/support_card/components/SupportCardActionDialog";
import useTicketActions from "@/hooks/useTicketActions";
import { useTicketsData } from "@/hooks/useTicketsData";
import { PaginationComponent } from "@/components/PaginationComponent";
import TicketList from "@/components/TicketList";
import MergeActionBar from "@/components/MergeActionBar";
import { ButtonAction } from "@/components/support_card/SupportCard";

const TICKETS_PER_PAGE = 50;

const Page: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const {
    tickets,
    error,
    loadMore,
    refreshData,
    selectedProject,
    setSelectedProject,
    currentPage,
    setCurrentPage,
    totalPages,
    hasNextPage,
  } = useTicketsData(client, currentAccount?.address!, TICKETS_PER_PAGE);

  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<
    SupportCardActionDialogData | undefined
  >(undefined);

  const { transferTicket, burnTicket, mergeTickets, splitTicket } =
    useTicketActions(async () => await refreshData());

  const handleCategorySelect = useCallback(
    (project: string) => {
      setSelectedCards([]);
      setIsMultiSelectMode(false);
      setSelectedProject(project === selectedProject ? null : project);
    },
    [selectedProject, setSelectedProject]
  );

  const handleSupportButtonClick = useCallback(
    (action: ButtonAction, name: string, id: string) => {
      if (action === "merge") {
        setIsMultiSelectMode(true);
        setSelectedProject(name);
        setSelectedCards([id]);
      } else {
        const ticket = tickets.find((item) => item.id === id);
        if (ticket) {
          setDialogData({ ticket, action });
          setIsDialogOpen(true);
        }
      }
    },
    [tickets, setSelectedProject]
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

  const handleMergeConfirm = async () => {
    if(selectedCards.length < 2) {
      handleMergeCancel();
      return;
    }
    await mergeTickets(selectedCards);
    setIsMultiSelectMode(false);
    setSelectedCards([]);
    await refreshData();
  };

  const handleMergeCancel = () => {
    setIsMultiSelectMode(false);
    setSelectedCards([]);
  };

  const handleActionDialogConfirm = async (c_data: ConfirmationData) => {
    const ticket = tickets.find((item) => item.id === c_data.id)!;
    switch (c_data.action) {
      case "transfer":
        await transferTicket(ticket, c_data.address!);
        break;
      case "split":
        await splitTicket(ticket, c_data.amount!, currentAccount!.address);
        break;
      case "burn":
        await burnTicket(ticket, currentAccount!.address);
        break;
      case "stake":
        console.log("Staking ticket:", c_data);
        break;
    }
  };

  if (error) return <div>Error loading tickets: {error.message}</div>;

  return (
    <div className="flex flex-col bg-[url('/assetsbg.png')] bg-cover bg-center h-[calc(100vh-10rem)] mt-40">
      <div className="flex flex-1 gap-x-16 overflow-hidden p-20">
        <div className="max-w-lg overflow-y-auto">
          <MarketNav
            tickets={tickets}
            onProjectSelect={handleCategorySelect}
            selectedProject={selectedProject}
          />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <TicketList
              filteredData={tickets}
              selectedCards={selectedCards}
              isMultiSelectMode={isMultiSelectMode}
              onButtonClick={handleSupportButtonClick}
              onCardClick={handleCardClick}
            />
          </div>
          {tickets.length > 4 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onLoadMore={loadMore}
            hasNextPage={hasNextPage}
          />
          )}
        </div>
      </div>
      {isMultiSelectMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MergeActionBar
            selectedCardsCount={selectedCards.length}
          onCancel={handleMergeCancel}
          onMerge={handleMergeConfirm}
          />
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
