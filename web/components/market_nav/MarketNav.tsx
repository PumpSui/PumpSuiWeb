import { ProjectReward } from "@/type";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface MarketNavProps {
  tickets: ProjectReward[];
  onProjectSelect: (category: string) => void;
  selectedProject: string | null;
}

const MarketNav: React.FC<MarketNavProps> = ({
  tickets,
  onProjectSelect,
  selectedProject,
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(tickets.map((ticket) => ticket.name))
    );
    setCategories(uniqueCategories);
  }, [tickets]);

  return (
    <nav className="flex flex-col border-r-2 border-gray-700 min-h-screen">
      <div className="px-8">
        <div className="w-40">
          {categories.map((category, index) => (
            <div key={index} className="mt-4">
              <Button
                variant={selectedProject === category ? "default" : "ghost"}
                onClick={() => onProjectSelect(category)}
              >
                <p className="font-bold">{category.toUpperCase()}</p>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MarketNav;
