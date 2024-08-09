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
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          {categories.map((category, index) => (
            <div key={index} className="mt-4">
              <Button
                variant={selectedProject === category ? "default" : "ghost"}
                onClick={() => onProjectSelect(category)}
              >
                {category}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MarketNav;
