// components/TicketList.tsx
import React from "react";
import SupportCard, { ButtonAction } from "@/components/support_card/SupportCard";
import { ProjectReward } from "@/type";

type TicketListProps = {
  filteredData: ProjectReward[];
  selectedCards: string[];
  isMultiSelectMode: boolean;
  onButtonClick: (action: ButtonAction, name: string, id: string) => void;
  onCardClick: (id: string) => void;
};

const TicketList: React.FC<TicketListProps> = ({
  filteredData,
  selectedCards,
  isMultiSelectMode,
  onButtonClick,
  onCardClick,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
    {filteredData.map((item) => (
      <SupportCard
        key={item.id}
        id={item.id}
        base64Image={item.image}
        name={item.name}
        amount={item.amount?.toString()}
        onButtonClick={onButtonClick}
        isSelected={selectedCards.includes(item.id)}
        isMultiSelectMode={isMultiSelectMode}
        onCardClick={onCardClick}
      />
    ))}
  </div>
);

export default TicketList;
