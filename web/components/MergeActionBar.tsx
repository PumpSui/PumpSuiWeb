// components/MergeActionBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";

type MergeActionBarProps = {
  selectedCardsCount: number;
  onCancel: () => void;
  onMerge: () => void;
};

const MergeActionBar: React.FC<MergeActionBarProps> = ({
  selectedCardsCount,
  onCancel,
  onMerge,
}) => (
  <div className="fixed top-24 left-0 right-0 bg-gray-800 p-4 flex justify-between items-center gap-5">
    <span className="text-white">Selected: {selectedCardsCount} cards</span>
    <Button className="ml-auto" onClick={onCancel} variant="destructive">
      Cancel
    </Button>
    <Button onClick={onMerge}>Merge Selected</Button>
  </div>
);

export default MergeActionBar;
