// components/MintCard.tsx
import React, { useState } from "react";
import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import { useProject } from "../providers/ProjectContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ProjectDetailItem from "./components/ProjectDetailItem";
import { getRealDate } from "@/lib/utils";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { useToast } from "../ui/use-toast";

interface ProjectCardProps extends ProjectRecord {
  onSubmitMint: (value: number) => void;
  onSubmitEdit: () => void;
  isStartMint: boolean;
  isCreator: boolean;
}

const MintCard: React.FC<ProjectCardProps> = ({
  onSubmitMint,
  onSubmitEdit,
  isStartMint,
  isCreator = false,
  remain,
  total_supply,
  amount_per_sui,
  name,
  start_time_ms,
  end_time_ms,
  min_value_sui,
  max_value_sui,
}) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(e.target.value));
  };

  const handleMint = () => {
    if (inputValue === undefined || inputValue < 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please input a valid number",
      });
    } else {
      onSubmitMint(inputValue);
    }
  };

  const handleEdit = () => { 
    onSubmitEdit();
  }

  return (
    <Card className={`max-w-sm bg-secondary rounded-2xl`}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <CardHeader>
            <CardTitle className="text-xl">
              <div className="">
                Mint Progress
                <Progress
                  value={(1 - remain / total_supply) * 100}
                  className="w-full mt-2 self-center min-h-8 bg-primary-foreground rounded-lg"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-white">
            <div className="flex justify-center max-h-min p-2">
              <h1 className="font-extrabold text-2xl max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-center">
                1 SUI = {amount_per_sui} {name}
              </h1>
            </div>
            <div className="text-sm p-2">
              <ProjectDetailItem
                label="START"
                value={getRealDate(start_time_ms)}
              />
              <ProjectDetailItem label="END" value={getRealDate(end_time_ms)} />
              <ProjectDetailItem
                label="TOTAL SUPPLY"
                value={total_supply.toString()}
              />
              <ProjectDetailItem
                label="Min"
                value={(BigInt(min_value_sui) / MIST_PER_SUI).toString()}
              />
              <ProjectDetailItem
                label="Max"
                value={(BigInt(max_value_sui) / MIST_PER_SUI).toString()}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col w-full max-w-sm space-y-5">
              <div className="flex justify-between items-center gap-5">
                <Input
                  type="number"
                  className="bg-primary-foreground w-1/2"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <p className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  Receive: {inputValue && inputValue * amount_per_sui} {name}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleMint}
                  disabled={isStartMint}
                >
                  Mint
                </Button>
                {isCreator && (
                  <Button
                    className="w-full"
                    variant={"destructive"}
                    type="submit"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default MintCard;
