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
    <Card className={`bg-white rounded-2xl`}>
      <div className="flex flex-col h-full py-8 px-10">
        <div className="flex-grow">
          <CardHeader >
            <CardTitle >
                <h1 className="font-extrabold tracking-wider text-black text-xl max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Progress"}
                </h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between">
            {/* Progress */}
            <div className="mb-7">
              <div className="flex flex-col justify-between">                
                <div className="inline-block space-x-1 self-end">
                  <p className="inline-block text-green-500 font-bold text-3xl">
                    {project.current_supply}
                  </p>
                  <p className="inline-block text-black text-sm">/</p>
                  <p className="inline-block text-black text-sm">
                    {project.total_supply}
                  </p>
                </div>
              </div>
              <Progress
                value={(1 - project.remain / project.total_supply) * 100}
                className="w-full h-7 mt-2 self-center min-h-6 bg-primary-foreground rounded-3xl"
                indicatorColor={"bg-green-500"}
                threshhold={project.threshold_ratio}
                showThreshholdText
                isBegin={project.begin}
              />
            </div>
            <div className="bg-gray-300 h-0.5" />
            {/* Time */}
            <div className="flex justify-between py-4">
              <div>
                {(() => {
                  const now = Date.now();
                  const endTime = project.end_time_ms;
                  const remainingTime = endTime - now;
                  const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

                  return (
                    <div className="text-sm p-2 flex gap-2 items-baseline">
                      <p className="text-black text-3xl font-bold">
                        {remainingDays}
                      </p>
                      <p className="text-black text-sm font-thin">Day Left</p>
                    </div>
                  );
                })()}
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
              </div>
            </div>
            <div className="bg-gray-300 h-0.5" />
            {/* Supply */}            
            <div className="flex justify-between py-4">
              <div className="flex h-full items-end gap-2">
                <p className="text-3xl font-bold text-black">{project.total_supply.toString()}</p>
                <p className="text-sm items-end text-black">Total Supply</p>
              </div>
              <div>
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
              </div>
            </div>
            <div className="bg-gray-300 h-0.5" />
            {/* Ratio */}
            <div className="w-full py-4">
              <Progress
                value={project.ratio}
                className="w-full mt-2 self-center min-h-6 bg-black rounded-full"
                indicatorColor={"bg-green-500"}
              />
              <div className="flex justify-between pt-1">
                <p className="font-bold text-green-500">
                  Project: {project.ratio}%
                </p>
                <p className="font-bold text-gray-700">
                  Users: {100 - project.ratio}%
                </p>
              </div>
            </div>
            <div className="bg-gray-300 h-0.5" />            
          </CardContent>

          <CardFooter>
            <div className="flex flex-col w-full space-y-5">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  className="bg-white w-1/3 rounded-full text-center text-black"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="inline-block  text-black">Sui<span className="text-black font-bold text-lg"> = {inputValue && inputValue * project.amount_per_sui}</span>
                  <span className="text-black"> {project.name}</span></p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-5 w-full">
                <Button
                  type="submit"
                  className="px-10 py-2 bg-black rounded-full text-green-400 ml-auto"
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
