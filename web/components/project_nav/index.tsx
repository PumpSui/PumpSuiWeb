// components/ProjectNavbar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/utils";
import { Portal } from "@radix-ui/react-portal";

interface ProjectNavbarProps {
  onTabChange: (value: string) => void;
  onSearch: (query: string) => void;
  onSort: (value: string) => void;
}

const ProjectNavbar: React.FC<ProjectNavbarProps> = ({
  onTabChange,
  onSearch,
  onSort,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 200),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <nav className="bg-background z-50 shadow-md">
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <div className="flex gap-5 items-center">
          <div className="flex gap-2">
            <Button 
              className={`bg-black text-white outline-white outline-2 rounded-3xl ${activeTab === "all" ? "bg-white text-black" : ""}`} 
              variant={"outline"} 
              size={"lg"} 
              onClick={() => handleTabChange("all")}
            >
              All
            </Button>
            <Button 
              className={`bg-black text-white outline-white outline-2 rounded-3xl ${activeTab === "supported" ? "bg-white text-black" : ""}`} 
              variant={"outline"} 
              size={"lg"} 
              onClick={() => handleTabChange("supported")}
            >
              Supported
            </Button>
            <Button 
              className={`bg-black text-white outline-white outline-2 rounded-3xl ${activeTab === "created" ? "bg-white text-black" : ""}`} 
              variant={"outline"} 
              size={"lg"} 
              onClick={() => handleTabChange("created")}
            >
              Created
            </Button>
          </div>

          <div className="hidden md:flex gap-2 relative flex-1 md:flex-grow-0 items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search project..."
              className="w-full rounded-3xl bg-black text-white pl-8 md:w-[200px] lg:w-[320px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="ml-auto relative">
            <Select onValueChange={onSort}>
              <SelectTrigger className="p-5 rounded-3xl bg-black text-white">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent className="bg-black text-white rounded-xl">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Tabs>
    </nav>
  );
};

export default ProjectNavbar;
