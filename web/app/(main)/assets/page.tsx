"use client";
import { getAllSupportTicket } from "@/api/suifund";
import MarketNav from "@/components/market_nav/MarketNav";
import SupportCard from "@/components/support_card/SupportCard";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { isValidSuiAddress } from "@mysten/sui/utils";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { ProjectReward } from "@/type"; // 确保这个导入路径是正确的

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
    setSelectedProject(project === selectedProject ? null : project);
  };

  return (
    <div className="flex">
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
            <div key={item.id}>
              <SupportCard
                base64Image={item.image}
                name={item.name}
                amount={item.amount.toString()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
