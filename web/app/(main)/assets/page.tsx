"use client";
import { getAllSupportTicket } from "@/api/suifund";
import MarketNav from "@/components/market_nav/MarketNav";
import SupportCard, {
  ButtonAction,
} from "@/components/support_card/SupportCard";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { isValidSuiAddress } from "@mysten/sui/utils";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { ProjectReward } from "@/type";

const Page = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const client = useSuiClient();
  const { data } = useSWR([client, address], ([client, address]) =>
    address && isValidSuiAddress(address)
      ? getAllSupportTicket(client, address)
      : null
  );

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ProjectReward[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      if (selectedProject) {
        setFilteredData(data.filter((item) => item.name === selectedProject));
      } else {
        setFilteredData(data);
      }
    }
  }, [data, selectedProject]);

  const handleCategorySelect = (project: string) => {
    setSelectedCards([]);
    setIsMultiSelectMode(false);
    setSelectedProject(project === selectedProject ? null : project);
  };

  const handleSupportButtonClick = (
    action: ButtonAction,
    name: string,
    id: string
  ) => {
    if (action === "merge") {
      setIsMultiSelectMode(true);
      setSelectedProject(name);
      setSelectedCards([id]);
    } else {
      // Handle other actions
      console.log(`Action: ${action}, Name: ${name}, ID: ${id}`);
    }
  };

  const handleCardClick = (id: string) => {
    if (isMultiSelectMode) {
      setSelectedCards((prev) =>
        prev.includes(id)
          ? prev.filter((cardId) => cardId !== id)
          : [...prev, id]
      );
    }
  };

  const handleMergeConfirm = () => {
    // Implement merge logic here
    console.log("Merging cards:", selectedCards);
    // Reset multi-select mode and selected cards
    setIsMultiSelectMode(false);
    setSelectedCards([]);
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
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-between items-center">
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
    </div>
  );
};

export default Page;
