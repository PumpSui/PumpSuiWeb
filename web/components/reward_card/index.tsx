'use client';

import { Project } from "@/type";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

const RewardCard: React.FC<Project> = ({
  creator,
  name,
  progress,
  startDate,
  endDate,
  description,
  imgUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-80 h-80 bg-cover bg-center rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imgUrl && (
        <Image
          src={imgUrl}
          alt="Project Image"
          layout="fill"
          objectFit="cover"
          className="-z-10"
        />
      )}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-opacity-90 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-secondary" variant="link">
            Transfer
          </Button>
          <Button className="bg-secondary" variant="link">
            Split
          </Button>
          <Button className="bg-secondary" variant="link">
            Burn
          </Button>
          <Button className="bg-secondary" variant="link">
            Stake
          </Button>
        </div>
        <div className="mt-4">
          <Button className="w-full bg-secondary" variant="link">
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
