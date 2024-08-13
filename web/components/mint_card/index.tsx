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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ProjectDetailItem from "./components/ProjectDetailItem";
import { getRealDate } from "@/lib/utils";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { useToast } from "../ui/use-toast";

interface ProjectCardProps {
  onSubmitMint: (value: number) => void;
  onSubmitEdit: () => void;
  onSubmitClaim: () => void;
  project: ProjectRecord;
  isStartMint: boolean;
  isCreator: boolean;
}

const MintCard: React.FC<ProjectCardProps> = ({
  onSubmitMint,
  onSubmitEdit,
  onSubmitClaim,
  isStartMint,
  isCreator = false,
  project,
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
  };

  const handleClaim = () => {
    onSubmitClaim();
  };

  return (
    <Card className={`max-w-sm bg-secondary rounded-2xl`}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <CardHeader>
            <CardTitle className="text-xl">
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="font-extrabold text-2xl max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {"Progress"}
                  </h1>
                  <div className="inline-block space-x-1">
                    <p className="inline-block text-orange-400 text-sm">
                      {project.current_supply}
                    </p>
                    <p className="inline-block">/</p>
                    <p className="inline-block text-blue-400 text-sm">
                      {project.total_supply}
                    </p>
                  </div>
                </div>
                <Progress
                  value={(1 - project.remain / project.total_supply) * 100}
                  className="w-full mt-2 self-center min-h-6 bg-primary-foreground rounded-lg "
                  indicatorColor={"bg-orange-400"}
                  threshhold={project.threshold_ratio}
                  showThreshholdText
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-white">
            <div className="flex justify-center max-h-min p-2">
              <h1 className="font-extrabold text-2xl max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-center">
                1 SUI = {project.amount_per_sui} {project.name}
              </h1>
            </div>
            <div className="text-sm p-2">
              <ProjectDetailItem
                label="START"
                value={getRealDate(project.start_time_ms)}
              />
              <ProjectDetailItem
                label="END"
                value={getRealDate(project.end_time_ms)}
              />
              {project.remain}
              <ProjectDetailItem
                label="TOTAL SUPPLY"
                value={project.total_supply.toString()}
              />
              <ProjectDetailItem
                label="Min"
                value={(
                  BigInt(project.min_value_sui) / MIST_PER_SUI
                ).toString()}
              />
              <ProjectDetailItem
                label="Max"
                value={(
                  BigInt(project.max_value_sui) / MIST_PER_SUI
                ).toString()}
              />
              <div className="flex justify-between mt-4">
                <p className="font-bold text-red-400">
                  Project: {project.ratio}%
                </p>
                <p className="font-bold text-blue-500">
                  Users: {100 - project.ratio}%
                </p>
              </div>
              <Progress
                value={project.ratio}
                className="w-full mt-2 self-center min-h-6 bg-blue-500 rounded-lg"
                indicatorColor={"bg-red-500"}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col w-full max-w-sm space-y-5">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  className="bg-primary-foreground w-1/3"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <p className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="inline-block font-bold text-blue-400">Sui</p> ={" "}
                  {inputValue && inputValue * project.amount_per_sui}{" "}
                  {project.name}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleMint}
                  disabled={project.remain <= 0 || isStartMint}
                >
                  {project.remain > 0 ? "Mint" : "Sold Out"}
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
              {isCreator && (
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleClaim}
                  disabled={!isCreator}
                >
                  Claim
                </Button>
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default MintCard;
