import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import SupportButton from "./components/SupportButton";
import { Button } from "../ui/button";

export type ButtonAction = "transfer" | "split" | "merge" | "burn" | "stake";

interface SupportCardProps {
  id: string;
  base64Image: string;
  name: string;
  amount: string;
  className?: string;
  onButtonClick: (action: ButtonAction, name: string, id: string) => void;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
  onCardClick?: (id: string) => void;
}

const SupportCard: React.FC<SupportCardProps> = React.memo(
  ({
    id,
    base64Image,
    name,
    amount,
    onButtonClick,
    className = "",
    isSelected = false,
    isMultiSelectMode = false,
    onCardClick,
  }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleButtonClick = useCallback(
      (action: ButtonAction) => {
        onButtonClick(action, name, id);
      },
      [onButtonClick, name, id]
    );

    const handleCardClick = useCallback(() => {
      if (isMultiSelectMode && onCardClick) {
        onCardClick(id);
      }
    }, [isMultiSelectMode, onCardClick, id]);

    const cardStyle = useMemo(
      () =>
      ({
        "--rotation": isFlipped && !isMultiSelectMode ? "180deg" : "0deg",
      } as React.CSSProperties),
      [isFlipped, isMultiSelectMode]
    );

    const frontSide = useMemo(
      () => (
        <div
          className={`group-hover:brightness-125 group-hover:contrast-125 group-hover:saturate-125`}
        >
          <div className="relative w-[261px] h-[408px] bg-[url('/supportbg.png')] bg-cover rounded-xl p-2 flex flex-col items-center gap-y-3">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[26px] bg-[#F1F4EE] rounded-b-lg flex items-end justify-center z-50">
              <p className="text-black text-[10px] truncate p-1">@{id}</p>
            </div>
            <div className="relative w-[245px] h-[245px]">
              <Image
                src={"/images/DemoProject.png"}
                alt="Project Image"
                fill
                style={{
                  objectFit: "cover",
                }}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col items-start gap-y-3 self-start p-2">
              <p className="text-black text-xl font-bold truncate self-start">{name}</p>
              <div>
                <p className="text-black text-sm truncate">Amount</p>
                <p className="text-black text-2xl truncate font-bold">{amount}</p>
              </div>
            </div>
          </div>

        </div>
      ),
      [base64Image, name, amount, id]
    );

    const backSide = useMemo(
      () => (
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative w-[261px] h-[408px] bg-[url('/supportbgflip.png')] bg-cover rounded-xl p-2 flex flex-col justify-between">
            <div className="w-full h-[126px] relative mb-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[26px] bg-[#F1F4EE] rounded-b-lg flex items-end justify-center z-50">
                <p className="text-black text-[10px] truncate p-1">@{id}</p>
              </div>
              <Image
                src={"/images/DemoProject.png"}
                alt="Project Image"
                fill
                style={{
                  objectFit: "cover",
                }}
                className="rounded-xl saturate-0 contrast-100"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex flex-col justify-end p-2">
                <p className="text-white text-xl font-bold truncate">{name}</p>
                <p className="text-white text-sm truncate">Amount</p>
                <p className="text-white text-2xl truncate font-bold">{amount}</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 w-full justify-between h-[408px-126px] pb-2">
              <Button className="w-full bg-gray-800 hover:bg-gray-800 hover:text-lime-400 text-white py-5" onClick={() => handleButtonClick("transfer")}>
                Transfer
              </Button>
              <Button className="w-full bg-gray-800 hover:bg-gray-800 hover:text-lime-400 text-white py-5" onClick={() => handleButtonClick("merge")}>
                Merge
              </Button>
              <Button className="w-full bg-gray-800 hover:bg-gray-800 hover:text-lime-400 text-white py-5" onClick={() => handleButtonClick("split")}>
                Split
              </Button>
              <Button className="w-full bg-gray-800 hover:bg-gray-800 hover:text-red-500 text-white py-5" onClick={() => handleButtonClick("burn")}>
                <p>Burn</p>
              </Button>
              <Button
                disabled
                className="w-full bg-gray-800 hover:bg-gray-800 hover:text-lime-400 text-white py-5"
                onClick={() => handleButtonClick("stake")}
              >
                Stake
              </Button>
            </div>
          </div>
        </div>
      ),
      [handleButtonClick, name, amount, id]
    );

    return (
      <div
        className={`relative w-[261px] h-[408px] ${className} ${isSelected ? "ring-4 ring-blue-500" : ""}`}
        onMouseEnter={useCallback(
          () => !isMultiSelectMode && setIsFlipped(true),
          [isMultiSelectMode]
        )}
        onMouseLeave={useCallback(
          () => !isMultiSelectMode && setIsFlipped(false),
          [isMultiSelectMode]
        )}
        onClick={handleCardClick}
      >
        <div
          className={`w-full h-full transition-all duration-700 [transform-style:preserve-3d]`}
          style={{
            transform: `rotateY(var(--rotation))`,
            ...cardStyle,
          }}
        >
          <div className="absolute w-full h-full backface-hidden">
            {frontSide}
          </div>
          {backSide}
        </div>
        {isMultiSelectMode && isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

SupportCard.displayName = "SupportCard";

export default SupportCard;
