// components/ProjectNavbar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "@/lib/utils";

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

  return (
    <nav className="bg-background z-50 shadow-md m-4">
      <Tabs defaultValue="all" onValueChange={onTabChange}>
        <div className="flex gap-5 items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="supported">Supported</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
          </TabsList>

          <div className="hidden md:flex gap-2 relative flex-1 md:flex-grow-0 items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search project..."
              className="w-full rounded-3xl bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="ml-auto">
            <Select onValueChange={onSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent>
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
